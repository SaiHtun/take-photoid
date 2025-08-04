import type { ClassValue } from "clsx";
import { cn } from "~/lib/utils";
import { validateImageFile } from "~/lib/utils/imageUtils";
import { useImageUpload } from "~/stores/use-file-upload";
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
        if (validateImageFile(file)) {
          addImage(file);
        }
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
        "outline h-9 outline-neutral-200 rounded-md flex items-center cursor-pointer bg-white shadow-xs group",
        props.twClasses
      )}
    >
      <Label
        htmlFor="photo"
        className="cursor-pointer group-hover:bg-accent  w-full h-full px-4"
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
