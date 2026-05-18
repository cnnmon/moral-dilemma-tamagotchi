import type { Metadata } from "next";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Toaster } from "sonner";
import localFont from "next/font/local";
import { PetProvider } from "./providers/PetProvider";
import Menu from "@/components/Menu";

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
      <body className={`${pixel.className} w-full min-h-screen flex`}>
        <div className="w-full flex flex-col p-4">
          <ConvexClientProvider>
            <PetProvider>
              <Menu />
              {children}
            </PetProvider>
          </ConvexClientProvider>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
