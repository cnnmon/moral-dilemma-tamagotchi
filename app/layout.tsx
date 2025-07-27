import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "sonner";
import localFont from "next/font/local";

const pixel = localFont({
  src: "./bitmap.otf",
});

export const metadata: Metadata = {
  title: "principal",
  description: "moral dilemma tamagotchi",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pixel.className} w-full min-h-screen flex items-center justify-center`}
      >
        <div className="w-full max-w-md flex flex-col items-center justify-center">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
