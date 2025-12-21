import type { Metadata } from "next";
import "./globals.css";
import { LayoutClient } from "./layout-client";

export const metadata: Metadata = {
  title: "Rommy's Workout Guide Browser",
  description: "Browse workout guides, anatomy, exercises, and formulas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
