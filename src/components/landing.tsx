import { getSampleImagesAppendHeroText } from "~/constants";
import AddPhotosButton from "./add-photos-button";
import { Button } from "./ui/button";

function HeroCard(props: {
  setIsPlayground: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="col-span-2 h-[220px] rounded-md border border-dashed border-neutral-200 flex flex-col items-center justify-center text-2xl space-y-4">
      <div>
        <p>
          take <span className="font-bold">PhotoID</span> securely.
        </p>
        <p>No uploads, No fees, No fuss!</p>
      </div>
      <div className="flex gap-4">
        <Button disabled>404</Button>
        <AddPhotosButton setIsPlayground={props.setIsPlayground} />
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
