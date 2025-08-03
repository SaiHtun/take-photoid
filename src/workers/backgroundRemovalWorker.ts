import { removeBackground } from "@imgly/background-removal";
import type {
  WorkerMessage,
  WorkerResponse,
} from "~/lib/services/backgroundRemovalService";

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { id, device, imageData, backgroundColor, targetDimensions } =
    event.data;

  try {
    // send initial progress
    self.postMessage({
      id,
      type: "PROGRESS",
      progress: 10,
    } as WorkerResponse);

    // Convert ImageData to OffscreenCanvas for processing
    const canvas = new OffscreenCanvas(imageData.width, imageData.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.putImageData(imageData, 0, 0);

    // send second progress
    self.postMessage({
      id,
      type: "PROGRESS",
      progress: 25,
    } as WorkerResponse);

    // can also postMessage during loading model
    const blob = await canvas.convertToBlob({ type: "image/png" });

    // send third progress
    self.postMessage({
      id,
      type: "PROGRESS",
      progress: 40,
    } as WorkerResponse);

    const resultBlob = await removeBackground(blob, { device });

    // send fourth progress
    self.postMessage({
      id,
      type: "PROGRESS",
      progress: 70,
    } as WorkerResponse);

    // Convert resultBlob back to ImageData
    const resultImageData = await createImageBitmap(resultBlob);
    const resultCanvas = new OffscreenCanvas(
      resultImageData.width,
      resultImageData.height
    );
    const resultCtx = resultCanvas.getContext("2d", {
      willReadFrequently: true,
    })!;

    // Apply background color
    resultCtx.fillStyle = backgroundColor;
    resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);

    resultCtx.drawImage(resultImageData, 0, 0);

    // Clean up ImageBitmap to free memory
    resultImageData.close();

    // send semi-final progress
    self.postMessage({
      id,
      type: "PROGRESS",
      progress: 90,
    } as WorkerResponse);

    // Resize to target dimensions if specified
    let finalCanvas = resultCanvas;
    let finalCtx = resultCtx;

    if (
      targetDimensions &&
      (resultCanvas.width !== targetDimensions.width ||
        resultCanvas.height !== targetDimensions.height)
    ) {
      finalCanvas = new OffscreenCanvas(
        targetDimensions.width,
        targetDimensions.height
      );
      finalCtx = finalCanvas.getContext("2d", { willReadFrequently: true })!;

      // Apply background color to final canvas
      finalCtx.fillStyle = backgroundColor;
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

      // Enable high-quality scaling
      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = "high";

      // Draw resized image
      finalCtx.drawImage(
        resultCanvas,
        0,
        0,
        resultCanvas.width,
        resultCanvas.height,
        0,
        0,
        targetDimensions.width,
        targetDimensions.height
      );
    }

    // Get the final ImageData
    const finalImageData = finalCtx.getImageData(
      0,
      0,
      finalCanvas.width,
      finalCanvas.height
    );
    // send final progress
    self.postMessage({
      id,
      type: "SUCCESS",
      progress: 100,
      processedImageData: finalImageData,
    } as WorkerResponse);
  } catch (error) {
    self.postMessage({
      id,
      type: "ERROR",
      error: error instanceof Error ? error.message : "Processing failed",
    } as WorkerResponse);
  }
};
