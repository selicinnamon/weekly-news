import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html", host: "localhost" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the bilingual editorial site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /The Weekly Edit/);
  assert.match(html, /少读一点/);
  assert.match(html, /News Summary/);
  assert.match(html, /Evidence Assessment/);
  assert.match(html, /How to Deal with the Taliban/);
  assert.match(html, /Could AIs Become Conscious\?/);
  assert.match(html, /本周新闻简报/);
  assert.match(html, /THE WEEK IN BRIEF/);
  assert.match(html, /观点与争鸣/);
  assert.match(html, /最强反方检验/);
  assert.match(html, /English brief/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("keeps the requested coverage, scoring and local filters", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  for (const category of ["国际", "经济", "社会", "文化", "科技"]) {
    assert.match(page, new RegExp(`category: "${category}"`));
  }
  assert.match(page, /importance:\s*\d+/);
  assert.match(page, /quality:\s*\d+/);
  assert.match(page, /useState<Category>/);
  assert.match(page, /setQuery/);
  assert.match(page, /setSource/);
  assert.match(page, /const briefs: BriefItem\[\]/);
  assert.match(page, /const commentary: CommentaryItem\[\]/);
  assert.equal((page.match(/id: "brief-/g) ?? []).length, 12);
  assert.equal((page.match(/id: "comment-/g) ?? []).length, 3);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
