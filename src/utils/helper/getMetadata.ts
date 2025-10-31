import { Metadata } from "next";

export function getMetadata(
  title = "Scordo",
  description = "Scordo app is to manage your cricket scores.",
  image: string | undefined = undefined
): Metadata {
  return {
    title,
    description,
    icons: {
      icon: image ?? undefined,
    },
  };
}
