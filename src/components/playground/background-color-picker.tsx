import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function BackgroundColorPicker(props: {
  color: string;
  onColorChange: (color: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative w-[140px] h-9">
      <Button
        variant="outline"
        className="h-full flex items-center justify-between space-x-2 px-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-geist-mono text-sm">Background</span>
        <div
          className="w-6 h-6 p-0 rounded-full border border-neutral-200 cursor-pointer hover:opacity-88"
          style={{ backgroundColor: props.color }}
        ></div>
      </Button>

      <HexColorPicker
        color={props.color}
        onChange={props.onColorChange}
        className={cn(
          "color_picker fixed z-50 opacity-0 -bottom-0 transition-all duration-150 ease-out pointer-events-none",
          {
            "opacity-100 -bottom-1.5 pointer-events-auto": isOpen,
          }
        )}
      />
    </div>
  );
}
