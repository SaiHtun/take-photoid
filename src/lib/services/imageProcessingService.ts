import { photoIdSizes } from "~/constants";

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ProcessedImageData {
  canvas: HTMLCanvasElement;
  dimensions: ImageDimensions;
  aspectRatio: number;
}

export class ImageProcessingService {
  private static readonly DPI = 300; // Standard DPI for high-quality photo printing
  private static readonly MM_TO_INCHES = 0.0393701;

  static parseSizeFromValue(sizeValue: string): ImageDimensions | null {
    const sizeConfig = photoIdSizes.find((size) => size.value === sizeValue);
    if (!sizeConfig) return null;

    const sizeMatch = sizeConfig.size.match(/(\d+)x(\d+)\s*mm/);
    if (!sizeMatch) return null;

    const widthMM = parseInt(sizeMatch[1]);
    const heightMM = parseInt(sizeMatch[2]);

    return ImageProcessingService.mmToPixels(widthMM, heightMM);
  }

  static mmToPixels(widthMM: number, heightMM: number): ImageDimensions {
    const widthInches = widthMM * ImageProcessingService.MM_TO_INCHES;
    const heightInches = heightMM * ImageProcessingService.MM_TO_INCHES;

    return {
      width: Math.round(widthInches * ImageProcessingService.DPI),
      height: Math.round(heightInches * ImageProcessingService.DPI),
    };
  }

  static async loadImageFromUrl(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () =>
        reject(new Error(`Failed to load image from URL: ${url}`));
      img.src = url;
    });
  }

  static async loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load image from file: ${file.name}`));
      };
      img.src = url;
    });
  }

  static calculateCropDimensions(
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number
  ): { x: number; y: number; width: number; height: number; scale: number } {
    const sourceAspect = sourceWidth / sourceHeight;
    const targetAspect = targetWidth / targetHeight;

    let cropWidth: number;
    let cropHeight: number;
    let scale: number;

    if (sourceAspect > targetAspect) {
      // Source is wider than target, crop from sides
      cropHeight = sourceHeight;
      cropWidth = sourceHeight * targetAspect;
      scale = targetHeight / sourceHeight;
    } else {
      // Source is taller than target, crop from top/bottom
      cropWidth = sourceWidth;
      cropHeight = sourceWidth / targetAspect;
      scale = targetWidth / sourceWidth;
    }

    const x = (sourceWidth - cropWidth) / 2;
    const y = (sourceHeight - cropHeight) / 2;

    return { x, y, width: cropWidth, height: cropHeight, scale };
  }

  static resizeAndCropImage(
    sourceImage: HTMLImageElement,
    targetDimensions: ImageDimensions
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    canvas.width = targetDimensions.width;
    canvas.height = targetDimensions.height;

    const cropInfo = ImageProcessingService.calculateCropDimensions(
      sourceImage.naturalWidth,
      sourceImage.naturalHeight,
      targetDimensions.width,
      targetDimensions.height
    );

    // Enable high-quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Draw the cropped and resized image
    ctx.drawImage(
      sourceImage,
      cropInfo.x,
      cropInfo.y,
      cropInfo.width,
      cropInfo.height,
      0,
      0,
      targetDimensions.width,
      targetDimensions.height
    );

    return canvas;
  }

  static async processImageFromUrl(
    url: string,
    sizeValue: string
  ): Promise<ProcessedImageData> {
    const targetDimensions =
      ImageProcessingService.parseSizeFromValue(sizeValue);
    if (!targetDimensions) {
      throw new Error(`Invalid size value: ${sizeValue}`);
    }

    const sourceImage = await ImageProcessingService.loadImageFromUrl(url);
    const canvas = ImageProcessingService.resizeAndCropImage(
      sourceImage,
      targetDimensions
    );

    return {
      canvas,
      dimensions: targetDimensions,
      aspectRatio: targetDimensions.width / targetDimensions.height,
    };
  }

  static async processImageFromFile(
    file: File,
    sizeValue: string
  ): Promise<ProcessedImageData> {
    const targetDimensions =
      ImageProcessingService.parseSizeFromValue(sizeValue);
    if (!targetDimensions) {
      throw new Error(`Invalid size value: ${sizeValue}`);
    }

    const sourceImage = await ImageProcessingService.loadImageFromFile(file);
    const canvas = ImageProcessingService.resizeAndCropImage(
      sourceImage,
      targetDimensions
    );

    return {
      canvas,
      dimensions: targetDimensions,
      aspectRatio: targetDimensions.width / targetDimensions.height,
    };
  }

  static getPreviewDimensions(
    targetDimensions: ImageDimensions,
    maxDisplaySize: number = 220
  ): ImageDimensions {
    const aspectRatio = targetDimensions.width / targetDimensions.height;

    if (targetDimensions.width > targetDimensions.height) {
      return {
        width: maxDisplaySize,
        height: Math.round(maxDisplaySize / aspectRatio),
      };
    } else {
      return {
        width: Math.round(maxDisplaySize * aspectRatio),
        height: maxDisplaySize,
      };
    }
  }
}
