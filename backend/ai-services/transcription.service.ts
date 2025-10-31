/**
 * Transcription Service
 * Handles audio transcription using OpenAI Whisper API
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:35 AM CST
 * Last Updated: October 31, 2025 9:35 AM CST
 */

import OpenAI from 'openai';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createReadStream } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import https from 'https';

export class TranscriptionService {
  private openai: OpenAI;
  private supabase: SupabaseClient;

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
  }

  /**
   * Download audio file from URL to temporary file
   */
  private async downloadAudioFile(fileUrl: string): Promise<string> {
    const tempFilePath = join(tmpdir(), `audio-${Date.now()}.mp3`);
    
    return new Promise((resolve, reject) => {
      const file = require('fs').createWriteStream(tempFilePath);
      
      https.get(fileUrl, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(tempFilePath);
        });
      }).on('error', (err) => {
        unlink(tempFilePath).catch(() => {});
        reject(err);
      });
    });
  }

  /**
   * Transcribe audio using Whisper API
   */
  public async transcribeAudio(audioId: string): Promise<void> {
    try {
      console.log(`[Transcription] Starting for audio ID: ${audioId}`);

      // Update status to processing
      await this.supabase
        .from('audio_recordings')
        .update({ transcript_status: 'processing' })
        .eq('id', audioId);

      // Get audio record
      const { data: audio, error: fetchError } = await this.supabase
        .from('audio_recordings')
        .select('file_url')
        .eq('id', audioId)
        .single();

      if (fetchError || !audio) {
        throw new Error('Audio recording not found');
      }

      // Download audio file to temp location
      const tempFilePath = await this.downloadAudioFile(audio.file_url);

      try {
        // Transcribe with Whisper
        const transcription = await this.openai.audio.transcriptions.create({
          file: createReadStream(tempFilePath),
          model: 'whisper-1',
          language: 'en',
          response_format: 'verbose_json',
          timestamp_granularities: ['word']
        });

        // Update database with transcript
        await this.supabase
          .from('audio_recordings')
          .update({
            transcript_text: transcription.text,
            transcript_status: 'complete'
          })
          .eq('id', audioId);

        console.log(`[Transcription] Complete for audio ID: ${audioId}`);
        console.log(`[Transcription] Text length: ${transcription.text.length} characters`);

        // Clean up temp file
        await unlink(tempFilePath);

      } catch (transcribeError) {
        // Clean up temp file on error
        await unlink(tempFilePath).catch(() => {});
        throw transcribeError;
      }

    } catch (error: any) {
      console.error(`[Transcription] Failed for audio ID: ${audioId}`, error);
      
      // Update status to error
      await this.supabase
        .from('audio_recordings')
        .update({
          transcript_status: 'error',
          transcript_text: `Error: ${error.message}`
        })
        .eq('id', audioId);

      throw error;
    }
  }

  /**
   * Transcribe multiple audio files
   */
  public async transcribeMultiple(audioIds: string[]): Promise<void> {
    console.log(`[Transcription] Processing ${audioIds.length} audio files`);
    
    for (const audioId of audioIds) {
      try {
        await this.transcribeAudio(audioId);
      } catch (error) {
        console.error(`[Transcription] Skipping audio ${audioId} due to error`);
        // Continue with next file
      }
    }
    
    console.log(`[Transcription] Batch complete`);
  }

  /**
   * Get all pending transcriptions
   */
  public async getPendingTranscriptions(): Promise<string[]> {
    const { data: pending, error } = await this.supabase
      .from('audio_recordings')
      .select('id')
      .eq('transcript_status', 'pending')
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Error fetching pending transcriptions:', error);
      return [];
    }

    return pending.map(rec => rec.id);
  }

  /**
   * Process pending transcriptions (for background job)
   */
  public async processPendingQueue(): Promise<number> {
    const pendingIds = await this.getPendingTranscriptions();
    
    if (pendingIds.length === 0) {
      console.log('[Transcription] No pending transcriptions');
      return 0;
    }

    console.log(`[Transcription] Found ${pendingIds.length} pending transcriptions`);
    await this.transcribeMultiple(pendingIds);
    
    return pendingIds.length;
  }
}
