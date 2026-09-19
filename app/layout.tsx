import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "The Weekly Edit｜英文刊物双语精选",
    description: "从英文新闻刊物中筛出真正值得读的议题与文章，以中英双语呈现。",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "The Weekly Edit｜少读一点，看懂更多",
      description: "7 期刊物、618 页内容，精选 8 个议题与 3 篇精读。",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "The Weekly Edit" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "The Weekly Edit",
      description: "少读一点，看懂更多。",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
