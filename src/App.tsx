import { useState } from "react";
import Landing from "./components/landing";
import Playground from "./components/playground";

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
