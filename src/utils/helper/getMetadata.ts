import { Metadata } from "next";

interface MetaProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
}
export function getMetadata({
  title = "Scordo",
  description = "Scordo app is to manage your cricket scores.",
  image,
}: MetaProps): Metadata {
  return {
    title,
    description,
    icons: {
      icon: image ?? undefined,
    },
  };
}
