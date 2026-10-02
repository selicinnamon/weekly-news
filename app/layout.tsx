import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "The Weekly Edit | Bilingual news reading",
    description: "A weekly English-first briefing, deeper reading and commentary, with Chinese translations.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "The Weekly Edit | Read less. Understand more.",
      description: "English-first news briefs, analysis and commentary with Chinese translations.",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "The Weekly Edit" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Weekly Edit",
      description: "Read less. Understand more.",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
