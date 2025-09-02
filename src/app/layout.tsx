import type { Metadata } from "next";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="layout-background dark:bg-red-600">
        <main className={`min-h-screen w-full antialiased`}>{children}</main>
      </body>
    </html>
  );
}
