import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RoastMy.cv — Get your resume roasted by AI 🔥",
  description:
    "Paste your resume. Get brutally honest AI feedback in 10 seconds. Free, anonymous, shareable. Three modes: Brutal Roast, Pro Feedback, Job Match.",
  keywords: [
    "resume roaster",
    "AI resume review",
    "CV review",
    "resume feedback",
    "career coach AI",
    "özgeçmiş roast",
    "AI resume roast",
  ],
  authors: [{ name: "RoastMy.cv" }],
  openGraph: {
    title: "RoastMy.cv — Get your resume roasted by AI 🔥",
    description:
      "Paste your resume. Get brutally honest AI feedback in 10 seconds. Free, anonymous, shareable.",
    url: "https://roastmy.cv",
    siteName: "RoastMy.cv",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoastMy.cv — Get your resume roasted by AI 🔥",
    description:
      "Paste your resume. Get brutally honest AI feedback in 10 seconds. Free, anonymous, shareable.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-950 text-neutral-100`}
      >
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
