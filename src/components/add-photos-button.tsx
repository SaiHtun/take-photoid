import type { ClassValue } from "clsx";
import { cn } from "~/lib/utils";
import { useImageUpload } from "~/stores/use-image-upload";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function AddPhotosButton(props: {
  setIsPlayground?: React.Dispatch<React.SetStateAction<boolean>>;
  twClasses?: ClassValue;
}) {
  const { addImage } = useImageUpload();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        addImage(file);
      });
      // Navigate to <Playground /> after uploading images
      if (files.length > 0) {
        props.setIsPlayground?.(true);
      }
    }
  };

  return (
    <div
      className={cn(
        "h-9 rounded-md flex items-center cursor-pointer bg-blue-600 text-neutral-50 shadow-sm group",
        props.twClasses
      )}
    >
      <Label
        htmlFor="photo"
        className="cursor-pointer group-hover:bg-blue-700 w-full h-full px-4 rounded-md"
      >
        Photos
      </Label>
      <Input
        id="photo"
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
      />
    </div>
  );
}
