import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import Providers from "@/components/Providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VSquad — 5-a-Side Fantasy Football",
  description:
    "Draft your 5-a-side squad, compete in tournaments, and climb the leaderboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full", spaceGrotesk.variable)}>
      <body className="h-full m-0">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
