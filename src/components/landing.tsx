import { getSampleImagesAppendHeroText } from "~/constants";
import { useImageUpload } from "~/stores/use-file-upload";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

function HeroCard(props: {
  setIsPlayground: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { addImage } = useImageUpload();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
          addImage(file);
        }
      });
      // Navigate to <Playground /> after uploading images
      if (files.length > 0) {
        props.setIsPlayground(true);
      }
    }
  };

  return (
    <div className="col-span-2 h-[220px] rounded-md bg-neutral-100 flex flex-col items-center justify-center text-2xl space-y-4">
      <div>
        <p>
          take <span className="font-bold">PhotoID</span> securely.
        </p>
        <p>No uploads, No fees, No fuss!</p>
      </div>
      <div className="flex gap-4">
        <Button disabled>Camera</Button>
        <div className="border border-neutral-300 rounded-md flex items-center cursor-pointer bg-white shadow-xs group">
          <Label
            htmlFor="photo"
            className="cursor-pointer group-hover:opacity-80  w-full h-full px-4"
          >
            Photo+
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
      </div>
    </div>
  );
}

export default function Landing(props: {
  setIsPlayground: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const sampleImages = getSampleImagesAppendHeroText();

  return (
    <div className="space-y-6">
      <div className="h-10"></div>
      {/* Desktop */}
      <div className="hidden md:grid grid-rows-2 grid-cols-3 gap-2 px-2">
        {sampleImages.map((src, index) => {
          return src === "hero_text" ? (
            <HeroCard key={src} setIsPlayground={props.setIsPlayground} />
          ) : (
            <img
              key={typeof src === "string" ? src : `uploaded-${index}`}
              src={src}
              alt="img for processing"
              className="w-[220px] h-[220px] object-cover rounded-md cursor-pointer"
              onClick={() => props.setIsPlayground(true)}
            />
          );
        })}
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-1 gap-y-2 px-2 md:hidden">
        <HeroCard setIsPlayground={props.setIsPlayground} />
        <div className="grid grid-cols-2 gap-2">
          {sampleImages
            .filter((src) => src !== "hero_text")
            .map((src, index) => (
              <img
                key={typeof src === "string" ? src : `uploaded-mobile-${index}`}
                src={src}
                alt="img for processing"
                className="w-full md:w-[220px] h-[220px] object-cover rounded-md cursor-pointer"
                onClick={() => props.setIsPlayground(true)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
