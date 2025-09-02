import { useState } from "react";
import CustomLink from "./components/custom-link";
import LandingPage from "./components/landing-page";
import Playground from "./components/playground";

export default function App() {
  const [isPlayground, setIsPlayground] = useState(false);

  return (
    <main className="min-h-dvh overflow-x-hidden">
      <nav className="px-6 py-4 shadow-xs" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          <h1 className="inline-block font-geist font-bold text-2xl text-blue-600">
            📸 ID Photo
          </h1>
          <span className="text-sm text-gray-600 hidden sm:inline">
            Free • Secure • Professional
          </span>
        </div>
      </nav>

      <section
        className="w-full sm:w-[670px] h-full min-h-[450px] mb-12 sm:my-12 mx-auto"
        aria-label={
          isPlayground ? "Photo editing workspace" : "Main application"
        }
      >
        {isPlayground ? (
          <Playground setIsPlayground={setIsPlayground} />
        ) : (
          <LandingPage setIsPlayground={setIsPlayground} />
        )}
      </section>
      <div className="h-10"></div>

      <footer className="text-center w-full fixed bottom-0 left-0 bg-white py-2 shadow text-sm border-t">
        <div className="max-w-screen-sm mx-auto px-4">
          <p className="text-gray-700">
            Built with ❤️ by <CustomLink src="https://saihtun.xyz" name="Sai" />{" "}
            |{" "}
            <CustomLink
              src="https://github.com/SaiHtun/take-photoid"
              name="OpenSource"
            />
          </p>
        </div>
      </footer>
    </main>
  );
}
