import { getSampleImagesAppendHeroText } from "~/constants";
import { Button } from "./ui/button";

function HeroText() {
  return (
    <div className="col-span-2 h-[220px] rounded-md bg-neutral-100 flex flex-col items-center justify-center text-2xl space-y-4">
      <div>
        <p>
          take <span className="font-bold">PhotoID</span> securely.
        </p>
        <p>No uploads, No fees, No fuss!</p>
      </div>
      <div className="flex gap-4">
        <Button>Camera</Button>
        <Button variant={"outline"}>Photo</Button>
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
        {sampleImages.map((src) => {
          return src === "hero_text" ? (
            <HeroText key={src} />
          ) : (
            <img
              key={src}
              src={src}
              alt="animal img"
              className="w-[220px] h-[220px] object-cover rounded-md cursor-pointer"
              onClick={() => props.setIsPlayground(true)}
            />
          );
        })}
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-1 gap-y-2 px-2 md:hidden">
        <HeroText />
        <div className="grid grid-cols-2 gap-2">
          {sampleImages
            .filter((src) => src !== "hero_text")
            .map((src) => (
              <img
                key={src}
                src={src}
                alt="animal img"
                className="w-full md:w-[220px] h-[220px] object-cover rounded-md cursor-pointer"
                onClick={() => props.setIsPlayground(true)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
