import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import test from 'node:test';

test('latest briefs have licensed, attributed contextual photos', async () => {
  const images = JSON.parse(await readFile(new URL('../data/editorial-images.json', import.meta.url), 'utf8'));
  for (const date of ['2026-10-25', '2026-11-01']) {
    const issue = JSON.parse(await readFile(new URL(`../data/editions/${date}.json`, import.meta.url), 'utf8'));
    for (const brief of issue.briefs) assert.equal(images[brief.id]?.length, 1, brief.id);
    for (const article of issue.commentary.filter(c => c.author.includes('editorial board'))) assert.equal(images[article.id], undefined);
  }
  for (const list of Object.values(images)) for (const image of list) {
    assert.ok(image.captionEn && image.captionZh && image.author && image.capturedAt && image.checkedAt);
    assert.ok(/^(CC BY(?:-SA)? [\d.]+|CC0|Public domain)$/.test(image.license), image.license);
    assert.equal(new URL(image.sourceUrl).hostname, 'commons.wikimedia.org');
    assert.ok(image.licenseUrl.startsWith('https://'));
    assert.ok(image.src.startsWith('/images/editorial/'));
    assert.ok((await stat(new URL(`../public${image.src}`, import.meta.url))).size > 1000);
    assert.ok(image.width > 0 && image.height > 0);
  }
});
