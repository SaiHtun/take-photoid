export function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number = 0.9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to convert canvas to blob"));
        }
      },
      "image/png",
      quality
    );
  });
}

export function blobToImageData(blob: Blob): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(imageData);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image from blob"));
    };

    img.src = url;
  });
}

export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Please upload a JPEG, PNG, or WebP image.",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size too large. Please upload an image smaller than 10MB.",
    };
  }

  return { isValid: true };
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string = "photo-id.png"
) {
  canvas.toBlob((blob) => {
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

export function getImageDataFromCanvas(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
