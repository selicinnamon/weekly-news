import { writeFile } from "node:fs/promises";

const origin = process.env.CF_PAGES_URL || "https://weekly-news-dc2.pages.dev";
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages-export", Date.now().toString());

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request(`${origin}/`, { headers: { accept: "text/html", host: new URL(origin).host } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) {
  throw new Error(`Static export failed with status ${response.status}`);
}

await writeFile(new URL("../dist/client/index.html", import.meta.url), await response.text());
console.log(`Exported static Pages build for ${origin}`);
