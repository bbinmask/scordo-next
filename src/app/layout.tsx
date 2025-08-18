import type { Metadata } from "next";
import { Urbanist, Cal_Sans, Poppins } from "next/font/google";
import "./globals.css";

const calSans = Cal_Sans({
  subsets: ["latin"],
  weight: ["400"],
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const urbanist = Urbanist({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "latin-ext"],
  style: ["normal"],
});
export const metadata: Metadata = {
  title: "Scordo",
  description: "Only platform that manages your cricket teams and scores",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="layout-background dark:bg-red-600">
        <main
          className={`min-h-screen w-full ${poppins.className} ${calSans.className} ${urbanist.className} antialiased`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
