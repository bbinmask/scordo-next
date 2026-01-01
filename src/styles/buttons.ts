export const confirmButtonClass = (variant: "primary" | "destructive" | "secondary") =>
  variant === "destructive"
    ? "rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-red-700"
    : "rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700";
