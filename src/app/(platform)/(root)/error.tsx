"use client";
export default function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-black">Something went wrong</h2>
      <p className="text-slate-500">{error.message}</p>
      <button onClick={reset} className="rounded-xl bg-green-600 px-6 py-2 text-white">
        Try Again
      </button>
    </div>
  );
}
