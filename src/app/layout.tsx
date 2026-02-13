import { Cal_Sans, Poppins, Urbanist, Inter } from "next/font/google";
import "../app/globals.css";
import { getMetadata } from "@/utils/helper/getMetadata";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const cal_sans = Cal_Sans({
  weight: "400",
  subsets: ["latin"],
});

const urbanist = Urbanist({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
export const metadata = getMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="layout-background">
        <ThemeProvider>
          <main
            className={`min-h-[calc(100vh-100px)] w-full antialiased ${poppins.className} ${urbanist.className} ${cal_sans.className} ${inter.className}`}
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
