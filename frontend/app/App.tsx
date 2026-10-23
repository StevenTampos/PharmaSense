import { useState } from "react";
import reactLogo from "@/assets/react.svg";

/**
 * Root component of the PharmaSense frontend.
 * Placeholder content styled with Tailwind CSS; replace it with routing and layout.
 *
 * @returns The rendered application.
 */
function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex items-center">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img
            src="/vite.svg"
            className="h-24 p-4 transition hover:drop-shadow-[0_0_2em_#646cffaa]"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="h-24 p-4 transition hover:drop-shadow-[0_0_2em_#61dafbaa] motion-safe:animate-[spin_20s_linear_infinite]"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-5xl font-semibold leading-tight">PharmaSense</h1>
      <div className="p-8">
        <button
          className="cursor-pointer rounded-lg border border-transparent bg-slate-100 px-5 py-2.5 font-medium transition-colors hover:border-indigo-500 dark:bg-neutral-800"
          onClick={() => setCount((currentCount) => currentCount + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code>frontend/app/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-neutral-500">Click on the Vite and React logos to learn more</p>
    </main>
  );
}

export default App;
