import { create } from "zustand";

interface UploadedImage {
  file: File;
  url: string;
  id: string;
}

interface ImageUploadState {
  images: UploadedImage[];
  addImage: (image: File) => void;
  removeImage: (id: string) => void;
  clearImages: () => void;
}

export const useImageUpload = create<ImageUploadState>((set, get) => ({
  images: [],
  addImage: (image) => {
    const url = URL.createObjectURL(image);
    const id = `${Date.now()}-${image.name}`;
    set((state) => ({
      images: [...state.images, { file: image, url, id }],
    }));
  },
  removeImage: (id) => {
    const state = get();
    const imageToRemove = state.images.find((img) => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    set((state) => ({
      images: state.images.filter((img) => img.id !== id),
    }));
  },
  clearImages: () => {
    const state = get();
    state.images.forEach((img) => URL.revokeObjectURL(img.url));
    set({ images: [] });
  },
}));
