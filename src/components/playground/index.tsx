import { Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { sampleImages } from "~/constants";
import { backgroundRemoverService } from "~/lib/services/backgroundRemovalService";
import { ImageProcessingService } from "~/lib/services/imageProcessingService";
import { cn } from "~/lib/utils";
import { useImageUpload } from "~/stores/use-file-upload";
import { Button } from "../ui/button";
import PlaygroundMenu from "./playground-menu";

interface ProcessedImage {
  id: string;
  originalSrc: string;
  processedCanvas?: HTMLCanvasElement;
  finalCanvas?: HTMLCanvasElement;
  selected: boolean;
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
      selected: false,
      progress: 0,
    }));
    setProcessedImages(initialImages);
  }, [uploadedImages]);

  const processAllImages = async () => {
    const currentImages = processedImages;
    if (currentImages.length === 0) return;

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

  const updateImage = (imageId: string, updates: Partial<ProcessedImage>) => {
    setProcessedImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, ...updates } : img))
    );
  };

  const processImage = async (imageId: string) => {
    try {
      const currentImages = processedImages;
      const currentImage = currentImages.find(
        (img) => img.id === imageId && img.selected
      );

      if (!currentImage) return;

      updateImage(imageId, {
        isProcessing: true,
        progress: 0,
        error: undefined,
      });
      updateImage(imageId, { progress: 10 });

      const processedData = await ImageProcessingService.processImageFromUrl(
        currentImage.originalSrc,
        selectedSize
      );

      updateImage(imageId, {
        progress: 30,
        processedCanvas: processedData.canvas,
      });

      const dims = ImageProcessingService.parseSizeFromValue(selectedSize);

      backgroundRemoverService.processImage({
        canvas: processedData.canvas,
        backgroundColor: backgroundColor,
        targetDimensions: dims || undefined,
        onProgress: (progress) => {
          updateImage(imageId, { progress: 30 + progress * 0.6 });
        },
        onSuccess: (resultCanvas) => {
          updateImage(imageId, {
            finalCanvas: resultCanvas,
            isProcessing: false,
            progress: 100,
          });
        },
        onError: (error) => {
          updateImage(imageId, {
            isProcessing: false,
            error,
            progress: 0,
          });
        },
      });
    } catch (error) {
      updateImage(imageId, {
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

  const handleDeleteImages = () => {
    if (hasSelectedImages()) {
      setProcessedImages((prevImage) =>
        prevImage.filter((img) => !img.selected)
      );
    }
  };

  const getSelectedImages = () => {
    return processedImages.filter((img) => img.selected);
  };

  const hasSelectedImages = () => {
    return getSelectedImages().length > 0;
  };

  const handleDownloadImages = () => {
    const selectedImages = getSelectedImages();

    selectedImages.forEach((image, index) => {
      // Get the best available image data
      let dataUrl = "";

      if (image.finalCanvas) {
        dataUrl = image.finalCanvas.toDataURL("image/png");
      } else if (image.processedCanvas) {
        dataUrl = image.processedCanvas.toDataURL("image/png");
      } else {
        // For original images, we need to convert to canvas first
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          dataUrl = canvas.toDataURL("image/png");
          downloadImage(dataUrl, `photo-${index + 1}.png`);
        };
        img.src = image.originalSrc;
        return; // Skip the immediate download for this image
      }

      if (dataUrl) {
        downloadImage(dataUrl, `photo-${index + 1}.png`);
      }
    });
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="px-2 space-y-6 mt-12">
      <PlaygroundMenu
        isUploadedImages={uploadedImages.length > 0}
        selectedSize={selectedSize}
        hasSelectedImages={hasSelectedImages()}
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
              className={cn(
                "w-full md:w-[220px] h-[220px] object-cover rounded-md border border-neutral-100 shadow-xs cursor-pointer",
                {
                  "outline-2 outline-blue-500": image.selected,
                }
              )}
              onClick={() =>
                updateImage(image.id, { selected: !image.selected })
              }
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

      {hasSelectedImages() && (
        <div className="flex justify-between items-center z-50">
          <Button
            variant="secondary"
            size="icon"
            className="size-10 cursor-pointer group rounded-full shadow-xs"
            onClick={handleDeleteImages}
          >
            <Trash2 className="text-red-600 group-hover:text-red-600/60 transition-colors" />
          </Button>
          <div className="rounded-3xl bg-neutral-100 px-6 py-2 text-sm">
            <p className="space-x-2">
              <span className="text-neutral-500">selected</span>
              <span>
                {getSelectedImages().length}
                {"  "}
                {getSelectedImages().length === 1 ? "photo" : "photos"}
              </span>
            </p>
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="size-10 cursor-pointer group rounded-full shadow-xs"
            onClick={handleDownloadImages}
          >
            <Download className="text-blue-600 group-hover:text-blue-600/60 transition-colors" />
          </Button>
        </div>
      )}
    </section>
  );
}
