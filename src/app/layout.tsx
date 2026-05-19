import { Poppins, Urbanist, Inter } from "next/font/google";
import "../app/globals.css";
import { getMetadata } from "@/utils/helper/getMetadata";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";

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
        <QueryProvider>
          <Toaster />

          <ThemeProvider>
            <ClerkProvider>
              <main
                className={`min-h-[calc(100vh-100px)] w-full antialiased ${poppins.className} ${urbanist.className} ${inter.className}`}
              >
                {children}
              </main>
            </ClerkProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
