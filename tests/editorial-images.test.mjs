import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import test from 'node:test';

test('briefs use only matched recent news photos; missing photos stay absent', async () => {
  const images = JSON.parse(await readFile(new URL('../data/editorial-images.json', import.meta.url), 'utf8'));
  for (const date of ['2026-10-25', '2026-11-01']) {
    const issue = JSON.parse(await readFile(new URL(`../data/editions/${date}.json`, import.meta.url), 'utf8'));
    for (const brief of issue.briefs) for (const image of images[brief.id] ?? []) {
      assert.equal(image.kind, 'news');
      assert.match(image.capturedAt, /^2026-10-(24|25|26|28)/);
    }
    for (const article of issue.commentary.filter(c => c.author.includes('editorial board'))) assert.equal(images[article.id], undefined);
  }
  for (const list of Object.values(images)) for (const image of list) {
    assert.ok(image.captionEn && image.captionZh && image.author && image.capturedAt && image.checkedAt);
    assert.ok(/^(CC BY(?:-SA)? [\d.]+|CC0|Public domain|La Moncloa reuse terms)$/.test(image.license), image.license);
    assert.ok(['commons.wikimedia.org', 'www.lamoncloa.gob.es'].includes(new URL(image.sourceUrl).hostname));
    assert.ok(image.licenseUrl.startsWith('https://'));
    assert.ok(image.src.startsWith('/images/editorial/'));
    assert.ok((await stat(new URL(`../public${image.src}`, import.meta.url))).size > 1000);
    assert.ok(image.width > 0 && image.height > 0);
  }
  assert.equal(Object.entries(images).filter(([key]) => key.startsWith('b-')).length, 4);
  assert.equal(images['b-20261101-spain'][0].attribution.includes('Ministerio de la Presidencia'), true);
});

test('October 18 adds only verified named-author portraits without news-image substitutes', async () => {
  const images = JSON.parse(await readFile(new URL('../data/editorial-images.json', import.meta.url), 'utf8'));
  const issue = JSON.parse(await readFile(new URL('../data/editions/2026-10-18.json', import.meta.url), 'utf8'));
  for (const brief of issue.briefs) assert.equal(images[brief.id], undefined);
  assert.equal(images['comment-20261018-middlepowers'], undefined);
  const coauthors = images['comment-20261018-ai-rules'];
  assert.equal(coauthors.length, 2);
  assert.match(coauthors[0].captionEn, /Lawrence Lessig/);
  assert.match(coauthors[1].captionEn, /Yoshua Bengio/);
  assert.match(images['comment-20261018-remnick'][0].captionEn, /David Remnick/);
  for (const id of ['comment-20261018-ai-rules', 'comment-20261018-remnick']) {
    for (const image of images[id]) {
      assert.equal(image.kind, 'portrait');
      assert.equal(image.checkedAt, '2026-11-04');
    }
  }
});
