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
  assert.match(html, /Read less/);
  assert.match(html, /少读一点/);
  assert.match(html, /News Summary/);
  assert.match(html, /Evidence Assessment/);
  assert.match(html, /Arms-twisting/);
  assert.match(html, /Houthi Strikes Hit Aramco/);
  assert.match(html, /School Roof Collapse/);
  assert.match(html, /The Babies Left Behind in America/);
  assert.match(html, /2026.10.12/);
  assert.match(html, /value="2026-10-18" selected/);
  assert.match(html, /value="2026-10-04"/);
  assert.match(html, /value="2026-09-27"/);
  assert.match(html, /PDF p\./);
  assert.match(html, /本周新闻简报/);
  assert.match(html, /THE WEEK IN BRIEF/);
  assert.match(html, /观点与争鸣/);
  assert.match(html, /The strongest challenge/);
  assert.match(html, /The week in brief/);
  assert.doesNotMatch(html, /HOW IT WORKS|EDITORIAL RECORD/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("October 18 edition preserves bilingual provenance and long-form boundaries", async () => {
  const issue = JSON.parse(await readFile(new URL("../data/editions/2026-10-18.json", import.meta.url), "utf8"));
  assert.equal(issue.briefs.length, 13);
  assert.equal(issue.topics.length, 8);
  assert.equal(issue.topics.filter(t => t.deepRead).length, 3);
  assert.equal(issue.topics.filter(t => t.featured).length, 8);
  assert.equal(issue.commentary.length, 3);
  assert.deepEqual(new Set(issue.topics.map(t => t.category)), new Set(["国际", "经济", "社会", "文化", "科技"]));
  assert.equal(issue.topics.filter(t => t.category === "科技").length, 1);
  const items = [...issue.briefs, ...issue.topics, ...issue.commentary];
  assert.equal(new Set(items.map(t => t.id)).size, items.length);
  for (const topic of issue.topics) {
    assert.equal(topic.score, topic.importance + topic.quality);
    assert.ok(topic.importance > 0 && topic.importance <= 60);
    assert.ok(topic.quality > 0 && topic.quality <= 40);
    for (const key of ["summaryEn", "summaryZh", "backgroundEn", "backgroundZh", "evidenceEn", "evidenceZh", "author", "pdfPages", "articleId"]) assert.ok(topic[key], `${topic.id}: ${key}`);
    assert.equal(topic.argumentEn.length, topic.argumentZh.length);
    assert.ok(topic.tags.every(pair => pair.length === 2 && pair.every(Boolean)));
    assert.ok(topic.tags.every(([zh, en]) => /\p{Script=Han}/u.test(zh) && !/\p{Script=Han}/u.test(en)), `${topic.id}: Chinese/English tag order`);
  }
  for (const brief of issue.briefs) {
    for (const key of ["summaryEn", "summaryZh", "titleEn", "titleZh", "source", "date"]) assert.ok(brief[key], `${brief.id}: ${key}`);
  }
  for (const comment of issue.commentary) {
    for (const key of ["thesisEn", "thesisZh", "backgroundEn", "backgroundZh", "evidenceEn", "evidenceZh"]) assert.ok(comment[key], `${comment.id}: ${key}`);
    assert.equal(comment.caseEn.length, comment.caseZh.length);
  }
  assert.equal(issue.sources.length, 23);
  assert.equal(issue.sources.reduce((n, source) => n + source.pages, 0), 1120);
  assert.match(issue.sources.find(s => s.publication === "Foreign Affairs").status, /truncated/);
  assert.equal(issue.topics.filter(t => t.source === "The Atlantic").length, 1);
  assert.equal(items.filter(t => t.source?.startsWith("Foreign Affairs")).length, 0);
  assert.equal(issue.audit.length, 10);
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
  assert.match(page, /scroll-snap|scrollBy/);
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
