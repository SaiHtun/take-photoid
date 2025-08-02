import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type NavigatorWithGPU = Navigator & { gpu?: unknown };

export function hasGPU() {
  // Check for WebGPU
  if (typeof (navigator as NavigatorWithGPU).gpu !== "undefined") {
    return true;
  }
  // Check for WebGL2
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl2") ||
    canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl");
  if (gl) {
    return true;
  }

  return false;
}

export function isSafari() {
  return (
    /safari/i.test(navigator.userAgent) &&
    !/chrome|crios|edg|opr|fxios/i.test(navigator.userAgent)
  );
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
