/**
 * Vector Database Service
 * Handles ChromaDB integration for storing and searching embeddings
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:59 AM CST
 * Last Updated: October 31, 2025 9:59 AM CST
 */

import { ChromaClient, Collection } from 'chromadb';
import { EmbeddingService } from './embedding.service';

interface VectorDocument {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    sourceType: 'audio' | 'photo' | 'textbook';
    sourceId: string;
    userId: string;
    classId: string;
    className?: string;
    timestamp?: string;
    pageNumber?: number;
    chunkIndex: number;
  };
}

interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata: VectorDocument['metadata'];
}

export class VectorDBService {
  private client: ChromaClient;
  private embeddingService: EmbeddingService;

  constructor() {
    const chromaUrl = process.env['CHROMADB_URL'] || 'http://localhost:8000';
    this.client = new ChromaClient({ path: chromaUrl });
    this.embeddingService = new EmbeddingService();
  }

  /**
   * Get or create collection for a class
   */
  private async getCollection(classId: string): Promise<Collection> {
    const collectionName = `class_${classId}_content`;
    
    try {
      // Try to get existing collection
      const collection = await this.client.getCollection({ name: collectionName });
      return collection;
    } catch (error) {
      // Create new collection if it doesn't exist
      console.log(`[VectorDB] Creating new collection: ${collectionName}`);
      const collection = await this.client.createCollection({
        name: collectionName,
        metadata: { classId }
      });
      return collection;
    }
  }

  /**
   * Store embeddings in ChromaDB
   */
  public async storeEmbeddings(documents: VectorDocument[]): Promise<void> {
    if (documents.length === 0) {
      console.log('[VectorDB] No documents to store');
      return;
    }

    const classId = documents[0]?.metadata.classId;
    if (!classId) {
      throw new Error('ClassId required in document metadata');
    }

    const collection = await this.getCollection(classId);

    console.log(`[VectorDB] Storing ${documents.length} documents in collection for class ${classId}`);

    // Prepare data for ChromaDB
    const ids = documents.map(doc => doc.id);
    const embeddings = documents.map(doc => doc.embedding);
    const metadatas = documents.map(doc => doc.metadata);
    const documents_text = documents.map(doc => doc.text);

    try {
      await collection.add({
        ids,
        embeddings,
        metadatas,
        documents: documents_text
      });

      console.log(`[VectorDB] Successfully stored ${documents.length} documents`);
    } catch (error: any) {
      console.error('[VectorDB] Failed to store embeddings:', error);
      throw new Error(`Failed to store embeddings: ${error.message}`);
    }
  }

  /**
   * Search for similar content using vector similarity
   */
  public async search(
    classId: string,
    query: string,
    topK: number = 5,
    filter?: {
      sourceType?: 'audio' | 'photo' | 'textbook';
      sourceId?: string;
    }
  ): Promise<SearchResult[]> {
    console.log(`[VectorDB] Searching class ${classId} for: "${query.substring(0, 50)}..."`);

    const collection = await this.getCollection(classId);

    // Generate embedding for query
    const queryEmbedding = await this.embeddingService.generateQueryEmbedding(query);

    // Build where filter
    const where: any = {};
    if (filter?.sourceType) {
      where.sourceType = filter.sourceType;
    }
    if (filter?.sourceId) {
      where.sourceId = filter.sourceId;
    }

    // Search ChromaDB
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
      where: Object.keys(where).length > 0 ? where : undefined
    });

    // Format results
    const searchResults: SearchResult[] = [];
    
    if (results.ids && results.ids[0]) {
      for (let i = 0; i < results.ids[0].length; i++) {
        searchResults.push({
          id: results.ids[0][i] as string,
          text: results.documents?.[0]?.[i] as string || '',
          score: results.distances?.[0]?.[i] as number || 0,
          metadata: results.metadatas?.[0]?.[i] as VectorDocument['metadata'] || {} as any
        });
      }
    }

    console.log(`[VectorDB] Found ${searchResults.length} results`);
    return searchResults;
  }

  /**
   * Delete all embeddings for a source
   */
  public async deleteSource(classId: string, sourceId: string): Promise<void> {
    console.log(`[VectorDB] Deleting embeddings for source ${sourceId} in class ${classId}`);

    const collection = await this.getCollection(classId);

    try {
      await collection.delete({
        where: { sourceId }
      });
      console.log(`[VectorDB] Deleted embeddings for source ${sourceId}`);
    } catch (error: any) {
      console.error('[VectorDB] Failed to delete source:', error);
      throw new Error(`Failed to delete source embeddings: ${error.message}`);
    }
  }

  /**
   * Get collection stats
   */
  public async getCollectionStats(classId: string): Promise<{ count: number }> {
    const collection = await this.getCollection(classId);
    const count = await collection.count();
    return { count };
  }

  /**
   * Delete entire collection for a class
   */
  public async deleteCollection(classId: string): Promise<void> {
    const collectionName = `class_${classId}_content`;
    console.log(`[VectorDB] Deleting collection: ${collectionName}`);

    try {
      await this.client.deleteCollection({ name: collectionName });
      console.log(`[VectorDB] Collection deleted successfully`);
    } catch (error: any) {
      console.error('[VectorDB] Failed to delete collection:', error);
      // Don't throw - collection might not exist
    }
  }
}
