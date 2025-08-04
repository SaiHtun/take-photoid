import { getSampleImagesAppendHeroText } from "~/constants";
import AddPhotosButton from "./add-photos-button";
import Pulse from "./pulse";

function HeroCard(props: {
  setIsPlayground: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="col-span-2 h-[220px] rounded-md border border-dashed border-neutral-200 flex flex-col items-center justify-center text-2xl space-y-4">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Create <span className="text-blue-600">Photo IDs</span> Instantly
        </h1>
        <p className="text-sm sm:text-lg text-gray-700 mb-1">
          Free passport photos, visa photos & ID pictures
        </p>
        <p className="text-sm sm:text-base text-gray-600">
          AI background removal • No uploads • Secure & Private
        </p>
      </div>
      <div className="flex gap-4">
        <AddPhotosButton setIsPlayground={props.setIsPlayground} />
      </div>
    </div>
  );
}

export default function LandingPage(props: {
  setIsPlayground: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const sampleImages = getSampleImagesAppendHeroText();

  return (
    <div className="space-y-2 sm:space-y-6 px-2">
      {/* SEO Content Header */}
      <header className="text-xs sm:text-[16px] text-center mt-10 sm:mt-0">
        <div className="max-w-4xl mx-auto space-y-1">
          <p className=" text-neutral-800">
            Your free
            <span className="font-semibold"> AI Photo ID </span>maker for all
            your document needs
          </p>
          <p className="mb-4 flex items-center justify-center gap-2 ">
            <Pulse />
            <span className=" text-blue-600 ">
              Complete privacy - your photos never leave your device
            </span>
          </p>
        </div>
        {/* Product update messages */}
        <div
          className="text-xs text-center w-full sm:w-fit rounded-2xl bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-1 mx-auto"
          role="alert"
          aria-live="polite"
        >
          📷 Camera feature coming soon - currently supports existing photos
        </div>
        <div className="h-10"></div>
      </header>

      {/* Desktop */}
      <div className="hidden md:grid grid-rows-2 grid-cols-3 gap-2">
        {sampleImages.map((src, index) => {
          return src === "hero_text" ? (
            <HeroCard key={src} setIsPlayground={props.setIsPlayground} />
          ) : (
            <img
              key={typeof src === "string" ? src : `uploaded-${index}`}
              src={src}
              className="w-[220px] h-[220px] object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => props.setIsPlayground(true)}
              loading="lazy"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  props.setIsPlayground(true);
                }
              }}
              aria-label="Click to edit this sample photo"
            />
          );
        })}
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-1 gap-y-2 md:hidden">
        <HeroCard setIsPlayground={props.setIsPlayground} />
        <div className="grid grid-cols-2 gap-2">
          {sampleImages
            .filter((src) => src !== "hero_text")
            .map((src, index) => (
              <img
                key={typeof src === "string" ? src : `uploaded-mobile-${index}`}
                src={src}
                className="w-full md:w-[220px] h-[220px] object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => props.setIsPlayground(true)}
                loading="lazy"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    props.setIsPlayground(true);
                  }
                }}
                aria-label="Click to edit this sample photo"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
