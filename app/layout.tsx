import type { Metadata } from "next";
import { Quicksand, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "$lol",
  description: "Community-powered memecoin. Games, governance, rewards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/bernoru" />
      </head>
      <body
        className={`${quicksand.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        {/* Global blurred background image */}
        <div className="fixed inset-0 -z-10">
          <img
            src="/hero-opacity.jpg"
            alt=""
            className="h-full w-full object-cover opacity-[0.14] blur-[2px]"
          />
          <div className="absolute inset-0 bg-background/40" />
        </div>

        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
