import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import BackgroundColorPicker from "./background-color-picker";
import PhotoSizeSelector from "./photo-size-selector";

export default function PlaygroundMenu(props: {
  selectedSize: string;
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>;
  backgroundColor: string;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  setIsPlayground: React.Dispatch<React.SetStateAction<boolean>>;
  onProcessImages: () => Promise<void>;
}) {
  return (
    <div className="w-full h-10 flex items-center justify-between">
      <div className="flex items-center  space-x-4">
        <Button
          variant="secondary"
          size="icon"
          className="size-8 cursor-pointer"
          onClick={() => props.setIsPlayground(false)}
        >
          <ArrowLeft />
        </Button>
        <PhotoSizeSelector
          selectedSize={props.selectedSize}
          onSizeChange={props.setSelectedSize}
        />
        <BackgroundColorPicker
          color={props.backgroundColor}
          onColorChange={props.setBackgroundColor}
        />
      </div>
      <Button 
        className="cursor-pointer bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-800 opacity-80 hover:opacity-100 transition-opacity duration-1000"
        onClick={props.onProcessImages}
      >
        <Sparkles />
      </Button>
    </div>
  );
}
