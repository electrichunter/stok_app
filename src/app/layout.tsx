import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-neutral-800  dark:text-white"
        style={{ fontFamily: "ui-sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
