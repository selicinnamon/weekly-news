import { mkdir, writeFile } from "node:fs/promises";

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

// Export real article URLs so direct links and refreshes work on static Pages.
const archiveResponse = await worker.fetch(new Request(`${origin}/analysis`, {headers: {host: new URL(origin).host}}), { ASSETS: {fetch: async () => new Response("Not found", {status: 404})} }, {waitUntil() {}, passThroughOnException() {}});
if (!archiveResponse.ok) throw new Error(`Analysis archive failed: ${archiveResponse.status}`);
const archive = await archiveResponse.text();
const paths = [...new Set([...archive.matchAll(/href="(\/analysis\/[^"?#]+\/?)"/g)].map(match => match[1]))];
if (paths.length < 1) throw new Error("No analysis pages found to export");
await mkdir(new URL("../dist/client/analysis/", import.meta.url), {recursive: true});
await writeFile(new URL("../dist/client/analysis/index.html", import.meta.url), archive);
for (const path of paths) {
  if (!/^\/analysis\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/$/.test(path)) throw new Error(`Invalid analysis path: ${path}`);
  const result = await worker.fetch(new Request(`${origin}${path.replace(/\/$/, "")}`, {headers: {host: new URL(origin).host}}), { ASSETS: {fetch: async () => new Response("Not found", {status: 404})} }, {waitUntil() {}, passThroughOnException() {}});
  if (!result.ok) throw new Error(`Analysis export failed: ${path} (${result.status})`);
  const target = new URL(`../dist/client${path}`, import.meta.url);
  await mkdir(target, {recursive: true});
  await writeFile(new URL("index.html", target), await result.text());
}
console.log(`Exported ${paths.length} analysis pages`);
console.log(`Exported static Pages build for ${origin}`);
