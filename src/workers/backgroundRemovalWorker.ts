import { removeBackground } from "@imgly/background-removal";
import type {
  WorkerMessage,
  WorkerResponse,
} from "../lib/backgroundRemovalService";

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { id, device, imageData, backgroundColor, customBgColor } = event.data;

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
    if (backgroundColor !== "transparent") {
      const bgColor =
        backgroundColor === "custom"
          ? customBgColor
          : backgroundColor === "blue"
            ? "#4285f4"
            : "#ffffff";

      resultCtx.fillStyle = bgColor || "#ffffff";
      resultCtx.fillRect(0, 0, resultCanvas.width, resultCanvas.height);
    }

    resultCtx.drawImage(resultImageData, 0, 0);

    // Clean up ImageBitmap to free memory
    resultImageData.close();

    // send semi-final progress
    self.postMessage({
      id,
      type: "PROGRESS",
      progress: 90,
    } as WorkerResponse);

    // Get the final ImageData
    const finalImageData = resultCtx.getImageData(
      0,
      0,
      resultCanvas.width,
      resultCanvas.height
    );
    // send semi-final progress
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
