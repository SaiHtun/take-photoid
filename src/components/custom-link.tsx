import type { ClassValue } from "clsx";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export default function CustomLink(props: {
  name: string;
  src: string;
  twClasses?: ClassValue;
}) {
  return (
    <Button
      variant={"link"}
      className={cn("font-geist-mono px-2 cursor-pointer", props.twClasses)}
      asChild
    >
      <a href={props.src}>{props.name}</a>
    </Button>
  );
}
