import { useEffect, useState } from "react";
import { sampleImages } from "~/constants";
import { backgroundRemoverService } from "~/lib/services/backgroundRemovalService";
import { ImageProcessingService } from "~/lib/services/imageProcessingService";
import { useImageUpload } from "~/stores/use-file-upload";
import PlaygroundMenu from "./playground-menu";

interface ProcessedImage {
  id: string;
  originalSrc: string;
  processedCanvas?: HTMLCanvasElement;
  finalCanvas?: HTMLCanvasElement;
  isProcessing: boolean;
  progress: number;
  error?: string;
}

export default function Playground(props: {
  setIsPlayground: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { images: uploadedImages } = useImageUpload();
  const [selectedSize, setSelectedSize] = useState("us-51x51");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);

  // Initialize images only once - use uploaded images if available, otherwise fallback to samples
  useEffect(() => {
    const imagesToUse =
      uploadedImages.length > 0
        ? uploadedImages.map((img) => img.url)
        : sampleImages;

    const initialImages: ProcessedImage[] = imagesToUse.map((src, index) => ({
      id: `image-${index}`,
      originalSrc: src,
      isProcessing: false,
      progress: 0,
    }));
    setProcessedImages(initialImages);
  }, [uploadedImages]);

  // Reset images when settings change (without auto-processing)
  // biome-ignore lint: deps[selectedSize, backgroundColor] is required
  useEffect(() => {
    if (processedImages.length === 0) return;
    resetAllImages();
  }, [selectedSize, backgroundColor]);

  function resetAllImages() {
    setProcessedImages((prev) =>
      prev.map((img) => ({
        ...img,
        finalCanvas: undefined,
        processedCanvas: undefined,
        isProcessing: false,
        progress: 0,
        error: undefined,
      }))
    );
  }

  const processAllImages = async () => {
    const currentImages = processedImages;
    if (currentImages.length === 0) return;

    // Reset all images first
    resetAllImages();

    // Process all images concurrently using the background workers
    const processingPromises = currentImages.map(async (image) => {
      if (image.originalSrc) {
        try {
          await processImage(image.id);
        } catch (error) {
          console.error("Failed to process:", image.id, error);
        }
      }
    });

    await Promise.all(processingPromises);
  };

  const processImage = async (imageId: string) => {
    const updateImage = (updates: Partial<ProcessedImage>) => {
      setProcessedImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, ...updates } : img))
      );
    };

    try {
      const currentImages = processedImages;
      const currentImage = currentImages.find((img) => img.id === imageId);

      if (!currentImage) {
        console.error("Could not find image with id:", imageId);
        return;
      }

      updateImage({ isProcessing: true, progress: 0, error: undefined });
      updateImage({ progress: 10 });

      const processedData = await ImageProcessingService.processImageFromUrl(
        currentImage.originalSrc,
        selectedSize
      );

      updateImage({ progress: 30, processedCanvas: processedData.canvas });

      const dims = ImageProcessingService.parseSizeFromValue(selectedSize);

      backgroundRemoverService.processImage({
        canvas: processedData.canvas,
        backgroundColor: backgroundColor,
        targetDimensions: dims || undefined,
        onProgress: (progress) => {
          updateImage({ progress: 30 + progress * 0.6 });
        },
        onSuccess: (resultCanvas) => {
          updateImage({
            finalCanvas: resultCanvas,
            isProcessing: false,
            progress: 100,
          });
        },
        onError: (error) => {
          updateImage({
            isProcessing: false,
            error,
            progress: 0,
          });
        },
      });
    } catch (error) {
      updateImage({
        isProcessing: false,
        error: error instanceof Error ? error.message : "Processing failed",
        progress: 0,
      });
    }
  };

  const getImagePreview = (image: ProcessedImage) => {
    if (image.finalCanvas) {
      return image.finalCanvas.toDataURL();
    }
    if (image.processedCanvas) {
      return image.processedCanvas.toDataURL();
    }
    return image.originalSrc;
  };

  return (
    <section className="px-2 space-y-6">
      <PlaygroundMenu
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        setIsPlayground={props.setIsPlayground}
        onProcessImages={processAllImages}
      />
      <div className="grid grid-rows-2 grid-cols-2 md:grid-cols-3 gap-2 ">
        {processedImages.map((image) => (
          <div key={image.id} className="relative">
            <img
              src={getImagePreview(image)}
              alt="processed img"
              className="w-full md:w-[220px] h-[220px] object-cover rounded-md border border-neutral-100 shadow-xs"
            />
            {image.isProcessing && (
              <div className="absolute inset-0 rounded-md flex flex-col items-center justify-center">
                <div
                  className="absolute inset-0 bg-gray-900 rounded-md transition-opacity duration-300"
                  style={{ opacity: Math.max(0.1, 1 - image.progress / 100) }}
                />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                  <span className="text-white text-sm font-medium drop-shadow-lg">
                    {Math.round(image.progress)}%
                  </span>
                </div>
              </div>
            )}
            {image.error && (
              <div className="absolute inset-0 bg-red-500 bg-opacity-75 rounded-md flex items-center justify-center">
                <span className="text-white text-xs text-center px-2">
                  Error: {image.error}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
