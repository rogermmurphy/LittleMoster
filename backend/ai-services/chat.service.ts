/**
 * AI Chat Service
 * Handles RAG-based chat with GPT-4 and source citation tracking
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 10:00 AM CST
 * Last Updated: October 31, 2025 10:00 AM CST
 */

import OpenAI from 'openai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { VectorDBService } from './vector-db.service';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  userId: string;
  classId: string;
  message: string;
  conversationId?: string;
  includeAudio?: boolean;
  includePhotos?: boolean;
  includeTextbooks?: boolean;
}

interface SourceCitation {
  type: 'audio' | 'photo' | 'textbook';
  id: string;
  title: string;
  timestamp?: string;
  pageNumber?: number;
  relevanceScore: number;
}

interface ChatResponse {
  conversationId: string;
  messageId: string;
  content: string;
  sources: SourceCitation[];
}

export class ChatService {
  private openai: OpenAI;
  private supabase: SupabaseClient;
  private vectorDB: VectorDBService;

  constructor() {
    const openaiKey = process.env['OPENAI_API_KEY'];
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    this.openai = new OpenAI({ apiKey: openaiKey });

    const supabaseUrl = process.env['SUPABASE_URL'];
    const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    this.vectorDB = new VectorDBService();
  }

  /**
   * Get or create conversation
   */
  private async getOrCreateConversation(
    userId: string,
    classId: string,
    conversationId?: string
  ): Promise<string> {
    if (conversationId) {
      // Verify conversation exists and belongs to user
      const { data: existing } = await this.supabase
        .from('chat_conversations')
        .select('id')
        .eq('id', conversationId)
        .eq('user_id', userId)
        .eq('class_id', classId)
        .single();

      if (existing) {
        return conversationId;
      }
    }

    // Create new conversation
    const { data: newConv, error } = await this.supabase
      .from('chat_conversations')
      .insert({
        user_id: userId,
        class_id: classId,
        title: 'New Conversation',
        message_count: 0
      })
      .select()
      .single();

    if (error || !newConv) {
      throw new Error('Failed to create conversation');
    }

    return newConv.id;
  }

  /**
   * Get conversation history
   */
  private async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    const { data: messages, error } = await this.supabase
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20); // Last 20 messages for context

    if (error) {
      console.error('Failed to fetch conversation history:', error);
      return [];
    }

    return messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));
  }

  /**
   * Retrieve relevant context from vector DB
   */
  private async retrieveContext(
    classId: string,
    query: string,
    filters: {
      includeAudio?: boolean;
      includePhotos?: boolean;
      includeTextbooks?: boolean;
    }
  ): Promise<{ context: string; sources: SourceCitation[] }> {
    console.log(`[Chat] Retrieving context for query in class ${classId}`);

    const allResults: any[] = [];

    // Search different source types if included
    if (filters.includeAudio !== false) {
      const audioResults = await this.vectorDB.search(classId, query, 3, { sourceType: 'audio' });
      allResults.push(...audioResults);
    }

    if (filters.includePhotos !== false) {
      const photoResults = await this.vectorDB.search(classId, query, 2, { sourceType: 'photo' });
      allResults.push(...photoResults);
    }

    if (filters.includeTextbooks !== false) {
      const textbookResults = await this.vectorDB.search(classId, query, 3, { sourceType: 'textbook' });
      allResults.push(...textbookResults);
    }

    // Sort by relevance score
    allResults.sort((a, b) => b.score - a.score);

    // Take top 5 overall
    const topResults = allResults.slice(0, 5);

    // Build context string
    const contextParts = topResults.map((result, index) => {
      const sourceLabel = result.metadata.sourceType === 'audio' ? '🎤 Lecture' :
                         result.metadata.sourceType === 'photo' ? '📸 Photo' :
                         '📚 Textbook';
      return `[Source ${index + 1} - ${sourceLabel}]\n${result.text}`;
    });

    const context = contextParts.join('\n\n');

    // Build source citations
    const sources: SourceCitation[] = await Promise.all(
      topResults.map(async (result) => {
        // Fetch source title from database
        let title = 'Unknown';
        const tableName = result.metadata.sourceType === 'audio' ? 'audio_recordings' :
                         result.metadata.sourceType === 'photo' ? 'photos' :
                         'textbook_downloads';

        const { data } = await this.supabase
          .from(tableName)
          .select('title')
          .eq('id', result.metadata.sourceId)
          .single();

        if (data) {
          title = data.title;
        }

        return {
          type: result.metadata.sourceType,
          id: result.metadata.sourceId,
          title,
          timestamp: result.metadata.timestamp,
          pageNumber: result.metadata.pageNumber,
          relevanceScore: result.score
        };
      })
    );

    console.log(`[Chat] Retrieved ${sources.length} relevant sources`);
    return { context, sources };
  }

  /**
   * Generate AI response with RAG
   */
  public async chat(request: ChatRequest): Promise<ChatResponse> {
    console.log(`[Chat] Processing message for user ${request.userId} in class ${request.classId}`);

    // Get or create conversation
    const conversationId = await this.getOrCreateConversation(
      request.userId,
      request.classId,
      request.conversationId
    );

    // Get conversation history
    const history = await this.getConversationHistory(conversationId);

    // Retrieve relevant context from vector DB
    const { context, sources } = await this.retrieveContext(
      request.classId,
      request.message,
      {
        includeAudio: request.includeAudio,
        includePhotos: request.includePhotos,
        includeTextbooks: request.includeTextbooks
      }
    );

    // Build system prompt with context
    const systemPrompt = context
      ? `You are an AI tutor helping a student understand their class materials. Use the following sources to answer the student's question accurately and helpfully. Cite sources when relevant.\n\n${context}`
      : 'You are an AI tutor. Help the student with their question to the best of your ability.';

    // Build messages for GPT-4
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: request.message }
    ];

    // Call GPT-4
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 1000
    });

    const assistantMessage = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Store user message
    await this.supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: request.message,
        sources: null,
        token_count: Math.ceil(request.message.length / 4)
      });

    // Store assistant message with sources
    const { data: assistantMsg, error: msgError } = await this.supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage,
        sources: sources.length > 0 ? sources : null,
        token_count: completion.usage?.completion_tokens || 0
      })
      .select()
      .single();

    if (msgError) {
      throw new Error('Failed to store message');
    }

    // Update conversation metadata
    await this.supabase
      .from('chat_conversations')
      .update({
        message_count: history.length + 2,
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    console.log(`[Chat] Response generated with ${sources.length} sources`);

    return {
      conversationId,
      messageId: assistantMsg.id,
      content: assistantMessage,
      sources
    };
  }

  /**
   * Get conversation by ID
   */
  public async getConversation(conversationId: string, userId: string) {
    const { data: conversation, error } = await this.supabase
      .from('chat_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (error || !conversation) {
      throw new Error('Conversation not found or access denied');
    }

    // Get messages
    const { data: messages } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    return {
      id: conversation.id,
      classId: conversation.class_id,
      title: conversation.title,
      messageCount: conversation.message_count,
      lastMessageAt: conversation.last_message_at,
      messages: messages || []
    };
  }

  /**
   * List user's conversations for a class
   */
  public async listConversations(userId: string, classId: string) {
    const { data: conversations, error } = await this.supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('class_id', classId)
      .order('last_message_at', { ascending: false });

    if (error) {
      throw new Error('Failed to retrieve conversations');
    }

    return conversations.map(conv => ({
      id: conv.id,
      classId: conv.class_id,
      title: conv.title,
      messageCount: conv.message_count,
      lastMessageAt: conv.last_message_at,
      createdAt: conv.created_at
    }));
  }

  /**
   * Delete conversation
   */
  public async deleteConversation(conversationId: string, userId: string) {
    const { data: conv } = await this.supabase
      .from('chat_conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (!conv) {
      throw new Error('Conversation not found or access denied');
    }

    const { error } = await this.supabase
      .from('chat_conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      throw new Error('Failed to delete conversation');
    }

    return { success: true, message: 'Conversation deleted successfully' };
  }
}
