import { useState } from "react";
import { sampleImages } from "~/constants";
import PlaygroundMenu from "./playground-menu";

export default function Playground(props: {
  setIsPlayground: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [selectedSize, setSelectedSize] = useState("us-51x51");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  return (
    <section className="px-2 space-y-6">
      <PlaygroundMenu
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        setIsPlayground={props.setIsPlayground}
      />
      <div className="grid grid-rows-2 grid-cols-2 md:grid-cols-3 gap-2 ">
        {sampleImages.map((src) => (
          <img
            key={src}
            src={src}
            alt="animal img"
            className="w-full md:w-[220px] h-[220px] object-cover rounded-md"
          />
        ))}
      </div>
    </section>
  );
}
