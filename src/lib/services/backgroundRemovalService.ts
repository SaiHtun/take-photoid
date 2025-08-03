import { hasGPU, isSafari } from "~/lib/utils/index";

export interface ProcessingJob {
  id: string;
  canvas: HTMLCanvasElement;
  backgroundColor: string; // color-hex string
  targetDimensions?: { width: number; height: number };
  onProgress?: (progress: number) => void;
  onSuccess?: (result: HTMLCanvasElement) => void;
  onError?: (error: string) => void;
}

export interface WorkerMessage {
  id: string;
  device: "gpu" | "cpu";
  type: "PROCESS_IMAGE";
  imageData: ImageData;
  backgroundColor: string;
  targetDimensions?: { width: number; height: number };
}

export interface WorkerResponse {
  id: string;
  type: "PROGRESS" | "SUCCESS" | "ERROR";
  progress?: number;
  processedImageData?: ImageData;
  error?: string;
}

class BackgroundRemoverService {
  private maxWorkers: number = Math.min(navigator.hardwareConcurrency || 4, 4);
  private workers: Worker[] = [];
  private jobQueue: ProcessingJob[] = [];
  private activeJobs: Map<string, ProcessingJob> = new Map();
  private availableWorkers: Worker[] = [];

  constructor() {
    this.initializeWorkers();
  }

  private imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }

  private handleWorkerMessage(worker: Worker, response: WorkerResponse) {
    const job = this.activeJobs.get(response.id);
    if (!job) return;

    switch (response.type) {
      case "PROGRESS":
        if (job.onProgress && response.progress !== undefined) {
          job.onProgress(response.progress);
        }
        break;
      case "SUCCESS":
        if (job.onSuccess && response.processedImageData) {
          const canvas = this.imageDataToCanvas(response.processedImageData);
          job.onSuccess(canvas);
        }
        this.completeJob(worker, response.id);
        break;
      case "ERROR":
        if (job.onError && response.error) {
          job.onError(response.error);
        }
        this.completeJob(worker, response.id);
        break;
    }
  }

  private handleWorkerError(worker: Worker, error: string) {
    // Find active job for this worker and handle Error
    for (const [jobId, job] of this.activeJobs.entries()) {
      if (job.onError) {
        job.onError(error);
      }

      this.completeJob(worker, jobId);
      break; // Only handle one job per worker error
    }
  }

  private initializeWorkers() {
    // Reduce worker count for Safari to prevent crashes
    const workerCount = isSafari()
      ? Math.min(this.maxWorkers, 2)
      : this.maxWorkers;

    for (let i = 0; i < workerCount; i++) {
      const worker = new Worker(
        new URL("../../workers/backgroundRemovalWorker.ts", import.meta.url),
        { type: "module" }
      );

      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        this.handleWorkerMessage(worker, event.data);
      };

      worker.onerror = (error) => {
        console.error("Worker error:", error);
        this.handleWorkerError(worker, error.message);
      };

      this.workers.push(worker);
      this.availableWorkers.push(worker);
    }
  }

  private completeJob(worker: Worker, jobId: string) {
    this.activeJobs.delete(jobId);
    this.availableWorkers.push(worker);
    this.processNextJob();
  }

  private processNextJob() {
    if (!this.jobQueue.length || !this.availableWorkers.length) return;

    const job = this.jobQueue.shift()!;
    const worker = this.availableWorkers.pop()!;

    this.activeJobs.set(job.id, job);
    // Convert canvas to imageData because Worker can't process canvas
    const ctx = job.canvas.getContext("2d", { willReadFrequently: true })!;
    const imageData = ctx.getImageData(
      0,
      0,
      job.canvas.width,
      job.canvas.height
    );

    const message: WorkerMessage = {
      id: job.id,
      device: hasGPU() ? "gpu" : "cpu",
      type: "PROCESS_IMAGE",
      imageData,
      backgroundColor: job.backgroundColor,
      targetDimensions: job.targetDimensions,
    };

    worker.postMessage(message);
  }

  public processImage(job: Omit<ProcessingJob, "id">): string {
    const jobWithId: ProcessingJob = {
      ...job,
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
    };

    this.jobQueue.push(jobWithId);
    this.processNextJob();
    return jobWithId.id;
  }
}

export const backgroundRemoverService = new BackgroundRemoverService();
