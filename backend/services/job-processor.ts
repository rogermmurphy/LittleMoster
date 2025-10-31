/**
 * Job Processor
 * Handles background job processing for transcriptions, OCR, and embeddings
 * 
 * Author: Ella K. Murphy (ella.k.murphy@gmail.com)
 * Created: October 31, 2025 9:36 AM CST
 * Last Updated: October 31, 2025 9:36 AM CST
 */

import Queue from 'bull';
import { TranscriptionService } from '../ai-services/transcription.service';

const REDIS_URL = process.env['REDIS_URL'] || 'redis://localhost:6379';

// Create job queues
export const transcriptionQueue = new Queue('audio-transcription', REDIS_URL);

const transcriptionService = new TranscriptionService();

/**
 * Process transcription jobs
 */
transcriptionQueue.process(async (job) => {
  const { audioId } = job.data;
  
  console.log(`[Job] Processing transcription for audio: ${audioId}`);
  
  try {
    await transcriptionService.transcribeAudio(audioId);
    return { success: true, audioId };
  } catch (error: any) {
    console.error(`[Job] Transcription failed:`, error);
    throw error;
  }
});

/**
 * Queue a transcription job
 */
export async function queueTranscription(audioId: string): Promise<void> {
  await transcriptionQueue.add(
    { audioId },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      },
      removeOnComplete: true,
      removeOnFail: false
    }
  );
  
  console.log(`[Queue] Transcription queued for audio: ${audioId}`);
}

/**
 * Process pending transcriptions (cron job)
 */
export async function processPendingTranscriptions(): Promise<void> {
  const pendingIds = await transcriptionService.getPendingTranscriptions();
  
  for (const audioId of pendingIds) {
    await queueTranscription(audioId);
  }
}

// Setup event listeners
transcriptionQueue.on('completed', (job, result) => {
  console.log(`[Queue] Job ${job.id} completed:`, result);
});

transcriptionQueue.on('failed', (job, err) => {
  console.error(`[Queue] Job ${job?.id} failed:`, err.message);
});

transcriptionQueue.on('stalled', (job) => {
  console.warn(`[Queue] Job ${job.id} stalled`);
});

export default {
  transcriptionQueue,
  queueTranscription,
  processPendingTranscriptions
};
