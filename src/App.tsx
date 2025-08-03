import { useState } from "react";
import Landing from "./components/landing";
import Playground from "./components/playground";

// import {
//   type BackgroundColor,
//   backgroundRemoverService,
// } from "./lib/services/backgroundRemovalService";

// interface ProcessingItem {
//   id: string;
//   canvas: HTMLCanvasElement;
//   originalFile: File;
//   progress: number;
//   result?: HTMLCanvasElement;
//   error?: string;
//   status: "pending" | "processing" | "completed" | "error";
// }

export default function App() {
  const [isPlayground, setIsPlayground] = useState(false);

  return (
    <main className="h-dvh overflow-x-hidden">
      <nav className="px-6 py-4 shadow-xs">
        <span className="inline-block font-semibold text-2xl">📸 PhotoID</span>
      </nav>
      <section className="w-full sm:w-[670px] h-full min-h-[450px] my-12 sm:my-12  mx-auto">
        {isPlayground ? (
          <Playground setIsPlayground={setIsPlayground} />
        ) : (
          <Landing setIsPlayground={setIsPlayground} />
        )}
      </section>
      <footer className="text-center w-full fixed bottom-0 left-0 bg-white py-2 shadow font-mono text-sm">
        <p>Built with ❤️ by Sai, Opensource.</p>
      </footer>
    </main>
  );
}

// export function Example() {
//   const [items, setItems] = useState<ProcessingItem[]>([]);
//   const [backgroundColor] = useState<BackgroundColor>("white");
//   const [customBgColor] = useState("#ffffff");
//   // const fileInputRef = useRef<HTMLInputElement>(null);

//   const fileToCanvas = (file: File): Promise<HTMLCanvasElement> => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.src = URL.createObjectURL(file);
//       img.onerror = reject;

//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;

//         const ctx = canvas.getContext("2d");
//         ctx?.drawImage(img, 0, 0);

//         URL.revokeObjectURL(img.src);
//         resolve(canvas);
//       };
//     });
//   };

//   const handleFileChange = async (files: FileList) => {
//     const itemPromises = Array.from(files)
//       .filter((file) => file.type.startsWith("image/"))
//       .map(async (file, index) => {
//         const canvas = await fileToCanvas(file);
//         const item: ProcessingItem = {
//           id: `batch_${Date.now()}_${index + 1}`,
//           canvas,
//           originalFile: file,
//           progress: 0,
//           status: "pending",
//         };

//         return item;
//       });

//     const resolvedItems = await Promise.all(itemPromises);
//     setItems((prev) => [...prev, ...resolvedItems]);
//   };

//   const updateItemProgress = (id: string, progress: number) => {
//     setItems((prevItems) => {
//       return prevItems.map((item) =>
//         item.id === id ? { ...item, progress } : item
//       );
//     });
//   };

//   const updateItemResult = (id: string, result: HTMLCanvasElement) => {
//     setItems((prevItems) => {
//       return prevItems.map((item) =>
//         item.id === id
//           ? {
//               ...item,
//               result,
//               progress: 100,
//               status: "completed",
//             }
//           : item
//       );
//     });
//   };

//   const updateItemError = (id: string, error: string) => {
//     setItems((prevItems) => {
//       return prevItems.map((item) =>
//         item.id === id ? { ...item, error } : item
//       );
//     });
//   };

//   const updateItemStatus = (id: string, status: ProcessingItem["status"]) => {
//     setItems((prevItems) => {
//       return prevItems.map((item) =>
//         item.id === id ? { ...item, status } : item
//       );
//     });
//   };

//   const processItems = () => {
//     const pendingItems = items.filter((item) => item.status === "pending");

//     pendingItems.forEach((item) => {
//       updateItemStatus(item.id, item.status);

//       backgroundRemoverService.processImage({
//         canvas: item.canvas,
//         backgroundColor,
//         customBgColor,
//         onProgress: (progress) => updateItemProgress(item.id, progress),
//         onSuccess: (result) => updateItemResult(item.id, result),
//         onError: (error) => updateItemError(item.id, error),
//       });
//     });
//   };

//   return (
//     <main>
//       <form>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           className="hidden"
//           id="file-upload"
//           onChange={(e) => e.target.files && handleFileChange(e.target.files)}
//         />
//         <label
//           htmlFor="file-upload"
//           style={{
//             cursor: "pointer",
//             padding: "8px 16px",
//             background: "#1976d2",
//             color: "#fff",
//             borderRadius: "4px",
//             display: "inline-block",
//           }}
//         >
//           Upload Images
//         </label>
//       </form>
//       <section className="flex gap-2">
//         {items.length > 0
//           ? items.map((item) => (
//               <canvas
//                 key={item.id}
//                 ref={(canvas) => {
//                   if (canvas && item.canvas) {
//                     canvas.width = item.canvas.width;
//                     canvas.height = item.canvas.height;
//                     const ctx = canvas.getContext("2d");
//                     if (!ctx) return;
//                     ctx.drawImage(item.canvas, 0, 0);
//                   }
//                 }}
//                 className="w-40 h-40 border border-gray-300 rounded object-cover"
//               />
//             ))
//           : null}
//       </section>
//       <button
//         type="button"
//         className="p-2 bg-orange-400 rounded-md text-white"
//         onClick={processItems}
//       >
//         RemoveBG
//       </button>
//       <section className="flex gap-2">
//         {items.length > 0
//           ? items.map((item) => (
//               <canvas
//                 key={item.id}
//                 ref={(canvas) => {
//                   if (canvas && item.result) {
//                     canvas.width = item.result.width;
//                     canvas.height = item.result.height;
//                     const ctx = canvas.getContext("2d");
//                     if (!ctx) return;
//                     ctx.drawImage(item.result, 0, 0);
//                   }
//                 }}
//                 className="w-40 h-40 border border-gray-300 rounded object-cover"
//               />
//             ))
//           : null}
//       </section>
//     </main>
//   );
// }
