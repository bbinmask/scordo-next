import "./globals.css";
import { Cal_Sans, Poppins, Urbanist } from "next/font/google";

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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="layout-background">
        <main className={`min-h-[calc(100vh-100px)] w-full antialiased`}>{children}</main>
      </body>
    </html>
  );
}
