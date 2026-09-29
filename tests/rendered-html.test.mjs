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
  assert.match(html, /Hegemon no more/);
  assert.match(html, /AI Agents Hit Two Federal Websites/);
  assert.match(html, /2026.09.21/);
  assert.match(html, /来源与编辑记录/);
  assert.match(html, /PDF 第/);
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
  assert.match(page, /useState<Category>/);
  assert.match(page, /setQuery/);
  assert.match(page, /setSource/);
  assert.match(page, /setEditionId/);
  assert.match(page, /searchParams.set\("edition"/);
  assert.match(layout, /og\.png/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("edition has complete bilingual fields, transparent sources and coverage", async () => {
  const issue = JSON.parse(await readFile(new URL("../data/editions/2026-09-27.json", import.meta.url), "utf8"));
  assert.equal(issue.briefs.length, 13);
  assert.equal(issue.topics.length, 8);
  assert.equal(issue.commentary.length, 3);
  assert.equal(issue.topics.filter(t => t.deepRead).length, 3);
  assert.equal(issue.topics.filter(t => t.category === "科技").length, 1);
  assert.deepEqual(new Set(issue.topics.map(t => t.category)), new Set(["国际","经济","社会","文化","科技"]));
  const ids = [...issue.briefs,...issue.topics,...issue.commentary].map(x => x.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const t of issue.topics) {
    assert.equal(t.score, t.importance + t.quality);
    assert.ok(t.importance <= 60 && t.quality <= 40);
    for (const key of ["summaryZh","summaryEn","backgroundZh","backgroundEn","evidenceZh","evidenceEn","author","pdfPages","articleId"]) assert.ok(t[key]?.length, `${t.id}: ${key}`);
    assert.equal(t.argumentZh.length, t.argumentEn.length);
    assert.ok(t.tags.every(pair => pair.length === 2 && pair.every(Boolean)));
  }
  for (const b of issue.briefs) assert.ok(b.summaryZh && b.summaryEn && b.date && b.source);
  for (const c of issue.commentary) {
    for (const key of ["backgroundZh","backgroundEn","evidenceZh","evidenceEn","thesisZh","thesisEn"]) assert.ok(c[key]);
    assert.equal(c.caseZh.length, c.caseEn.length);
  }
  assert.equal(issue.sources.length, 10);
  assert.equal(issue.sources.reduce((n,s) => n+s.pages,0), 664);
  assert.match(issue.sources.find(s => s.publication === "FT Weekend Magazine").status, /未成功/);
  assert.equal(issue.audit.length, 10);
  const archive = await readFile(new URL("../data/editions/pilot.ts", import.meta.url), "utf8");
  assert.match(archive, /How to Deal with the Taliban/);
  assert.equal((archive.match(/id: "brief-/g) ?? []).length, 12);
});
