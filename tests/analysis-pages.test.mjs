import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {stripTypeScriptTypes} from 'node:module';
import test from 'node:test';

async function editions() {
  const result = [];
  for (const file of ['2026-11-01.json', '2026-10-25.json', '2026-10-18.json', '2026-10-04.ts', '2026-09-27.json', 'pilot.ts']) {
    const raw = await readFile(new URL(`../data/editions/${file}`, import.meta.url), 'utf8');
    if (file.endsWith('.json')) result.push(JSON.parse(raw));
    else {
      const js = stripTypeScriptTypes(raw);
      const module = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
      result.push(file === 'pilot.ts' ? {id: 'pilot', ...module} : module.october4);
    }
  }
  return result;
}

test('every brief and highlight explains real-world significance within 60 characters', async () => {
  let count = 0;
  for (const issue of await editions()) for (const item of [...issue.briefs, ...issue.topics]) {
    assert.ok([...item.why].length <= 60 && item.why.length > 0, item.id);
    assert.doesNotMatch(item.why, /本期|首选|名额|入选|精读|文化入口|符合.*兴趣/, item.id);
    count++;
  }
  assert.equal(count, 125);
});

test('all 48 analysis pages are exported with full content and edition-specific return links', async () => {
  let count = 0;
  for (const issue of await editions()) for (const topic of issue.topics) {
    const path = `analysis/${issue.id}/${topic.id}/index.html`;
    const html = await readFile(new URL(`../dist/client/${path}`, import.meta.url), 'utf8');
    for (const label of ['News Summary', 'Background', 'Argument Outline', 'Evidence Assessment', 'Reading caveat']) assert.ok(html.includes(label), `${path}: ${label}`);
    assert.ok(html.includes(topic.title.replaceAll('&', '&amp;').replaceAll("'", '&#x27;').replaceAll('"', '&quot;')) || html.includes(topic.title), path);
    assert.ok(html.includes(`/?edition=${issue.id}#${topic.id}`), path);
    assert.ok((await stat(new URL(`../dist/client/${path}`, import.meta.url))).size > 1000);
    count++;
  }
  assert.equal(count, 48);
});

test('home links titles to standalone analysis and all rendered image captions are English-only', async () => {
  const html = await readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8');
  assert.match(html, /href="\/analysis\/2026-11-01\/t-20261101-israel\//);
  assert.doesNotMatch(html, /Explore the full analysis|analysis-drawer|Why this read matters/);
  const captions = [...html.matchAll(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/g)];
  assert.ok(captions.length >= 5);
  for (const [,caption] of captions) assert.doesNotMatch(caption, /\p{Script=Han}/u);
});

test('unknown analysis editions and articles return 404 rather than unrelated content', async () => {
  const {default: worker} = await import(new URL('../dist/server/index.js', import.meta.url));
  for (const path of ['/analysis/2026-11-01/missing', '/analysis/missing/t-20261101-israel']) {
    const response = await worker.fetch(new Request(`http://localhost${path}`), {ASSETS: {fetch: async () => new Response('Not found', {status:404})}}, {waitUntil() {}, passThroughOnException() {}});
    assert.equal(response.status, 404, path);
  }
});
