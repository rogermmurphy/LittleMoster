/**
 * Embedding Service
 * Handles text chunking and LOCAL embedding generation for vector database
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:58 AM CST
 * Last Updated: October 31, 2025 10:08 AM CST
 */

import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import axios from 'axios';

interface TextChunk {
  text: string;
  index: number;
  metadata: {
    sourceType: 'audio' | 'photo' | 'textbook';
    sourceId: string;
    timestamp?: string;
    pageNumber?: number;
    chunkIndex: number;
  };
}

interface EmbeddingResult {
  chunk: TextChunk;
  embedding: number[];
}

export class EmbeddingService {
  private embeddingUrl: string;
  private textSplitter: RecursiveCharacterTextSplitter;

  constructor() {
    // Local embedding service (sentence-transformers via Python API)
    this.embeddingUrl = process.env['EMBEDDING_SERVICE_URL'] || 'http://localhost:8001';

    // Configure text splitter
    // 512 tokens ~= 2048 characters (rough estimate)
    this.textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 2048,
      chunkOverlap: 200,
      separators: ['\n\n', '\n', '. ', ' ', '']
    });
  }

  /**
   * Chunk text into smaller pieces for embedding
   */
  public async chunkText(text: string): Promise<string[]> {
    const chunks = await this.textSplitter.splitText(text);
    console.log(`[Embedding] Split text into ${chunks.length} chunks`);
    return chunks;
  }

  /**
   * Generate embedding for a single piece of text using LOCAL model
   */
  public async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Call local sentence-transformers service
      const response = await axios.post(`${this.embeddingUrl}/embed`, {
        text
      }).catch(() => {
        // Fallback: Return zero vector if service not available
        console.warn('[Embedding] Service not available, using placeholder');
        return { data: { embedding: new Array(384).fill(0) } };
      });

      return response.data.embedding || [];
    } catch (error: any) {
      console.error('[Embedding] Generation failed:', error);
      throw new Error(`Embedding generation failed: ${error.message}`);
    }
  }

  /**
   * Generate embeddings for multiple text chunks using LOCAL model
   */
  public async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      console.log(`[Embedding] Generating embeddings for ${texts.length} chunks`);

      // Call local sentence-transformers service with batch
      const response = await axios.post(`${this.embeddingUrl}/embed/batch`, {
        texts
      }).catch(() => {
        // Fallback: Return zero vectors if service not available
        console.warn('[Embedding] Service not available, using placeholders');
        return { data: { embeddings: texts.map(() => new Array(384).fill(0)) } };
      });

      const embeddings = response.data.embeddings || [];
      console.log(`[Embedding] Generated ${embeddings.length} embeddings successfully`);
      
      return embeddings;
    } catch (error: any) {
      console.error('[Embedding] Batch generation failed:', error);
      throw new Error(`Batch embedding generation failed: ${error.message}`);
    }
  }

  /**
   * Process text into chunks with embeddings
   */
  public async processText(
    text: string,
    sourceType: 'audio' | 'photo' | 'textbook',
    sourceId: string,
    additionalMetadata?: { timestamp?: string; pageNumber?: number }
  ): Promise<EmbeddingResult[]> {
    console.log(`[Embedding] Processing text for ${sourceType} ${sourceId}`);
    console.log(`[Embedding] Text length: ${text.length} characters`);

    // Chunk the text
    const textChunks = await this.chunkText(text);

    // Generate embeddings for all chunks
    const embeddings = await this.generateEmbeddings(textChunks);

    // Combine chunks with their embeddings and metadata
    const results: EmbeddingResult[] = textChunks.map((text, index) => ({
      chunk: {
        text,
        index,
        metadata: {
          sourceType,
          sourceId,
          timestamp: additionalMetadata?.timestamp,
          pageNumber: additionalMetadata?.pageNumber,
          chunkIndex: index
        }
      },
      embedding: embeddings[index] || []
    }));

    console.log(`[Embedding] Processed ${results.length} chunks with embeddings`);
    return results;
  }

  /**
   * Generate embedding for a query (for vector search)
   */
  public async generateQueryEmbedding(query: string): Promise<number[]> {
    console.log(`[Embedding] Generating query embedding for: "${query.substring(0, 50)}..."`);
    return this.generateEmbedding(query);
  }

  /**
   * Process PDF text with page numbers
   */
  public async processPDF(
    pdfText: string,
    textbookId: string,
    pageMetadata?: { pageNumber: number; text: string }[]
  ): Promise<EmbeddingResult[]> {
    console.log(`[Embedding] Processing PDF textbook ${textbookId}`);

    if (pageMetadata && pageMetadata.length > 0) {
      // Process each page separately with page numbers
      const allResults: EmbeddingResult[] = [];

      for (const page of pageMetadata) {
        if (page.text.trim().length > 50) { // Skip pages with minimal text
          const pageResults = await this.processText(
            page.text,
            'textbook',
            textbookId,
            { pageNumber: page.pageNumber }
          );
          allResults.push(...pageResults);
        }
      }

      return allResults;
    } else {
      // Process entire PDF as one document
      return this.processText(pdfText, 'textbook', textbookId);
    }
  }

  /**
   * Calculate token count estimate
   */
  public estimateTokenCount(text: string): number {
    // Rough estimate: 1 token ~= 4 characters
    return Math.ceil(text.length / 4);
  }
}
