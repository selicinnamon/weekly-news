import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
const issue = JSON.parse(await readFile(new URL('../data/editions/2026-11-08.json',import.meta.url),'utf8'));

test('November 8 delivers an independently sourced complete bilingual edition',()=>{
 assert.equal(issue.briefs.length,13); assert.equal(issue.topics.length,8); assert.equal(issue.commentary.length,3);
 assert.equal(issue.sources.length,28); assert.equal(issue.sources.reduce((n,s)=>n+s.pages,0),1578);
 assert.equal(issue.audit.length,10);
 assert.equal(issue.topics.filter(t=>t.deepRead).length,3);
 assert.equal(issue.topics.filter(t=>t.category==='科技').length,1);
 assert.deepEqual(new Set(issue.topics.map(t=>t.category)),new Set(['国际','经济','社会','文化','科技']));
 const all=[...issue.briefs,...issue.topics,...issue.commentary];
 assert.equal(new Set(all.map(t=>t.id)).size,24);
 for(const t of all) {
  assert.equal(t.original.checkedAt,'2026-11-10');
  for(const l of t.original.links) {
   assert.equal(new URL(l.url).protocol,'https:');
   assert.ok(['www.economist.com','www.theguardian.com','www.newyorker.com'].includes(new URL(l.url).hostname));
   assert.ok(['free','subscription','gift'].includes(l.access));
  }
 }
 for(const t of issue.topics) {
  assert.equal(t.score,t.importance+t.quality); assert.ok(t.importance<=60&&t.quality<=40);
  for(const k of ['articleId','author','genre','pages','pdfPages','summaryEn','summaryZh','backgroundEn','backgroundZh','evidenceEn','evidenceZh','limits']) assert.ok(t[k]?.length,`${t.id}:${k}`);
  assert.equal(t.argumentEn.length,t.argumentZh.length);
  assert.ok(t.tags.every(([zh,en])=>/\p{Script=Han}/u.test(zh)&&!/\p{Script=Han}/u.test(en)));
 }
 for(const c of issue.commentary) {
  for(const k of ['articleId','thesisEn','thesisZh','backgroundEn','backgroundZh','evidenceEn','evidenceZh','position','value','challenge']) assert.ok(c[k],c.id+':'+k);
  assert.equal(c.caseEn.length,c.caseZh.length);
 }
 assert.ok(issue.topics.filter(t=>t.deepRead).every(t=>t.original.links.length));
});

test('November 8 preserves event, print-cutoff and monthly-source boundaries',()=>{
 assert.match(issue.briefs[0].summaryEn,/take office in January/);
 assert.match(issue.briefs.find(b=>b.id.endsWith('ukraine')).summaryEn,/Zelensky said 43/);
 assert.match(issue.briefs.find(b=>b.id.endsWith('markets')).summaryEn,/Nasdaq Composite/);
 assert.match(issue.briefs.find(b=>b.id.endsWith('ebola')).summaryEn,/October, not this week/);
 assert.match(issue.topics.find(t=>t.id.endsWith('alzheimers')).issue,/ONLINE NOV 2/);
 assert.match(issue.commentary.find(c=>c.id.endsWith('marcus')).source,/PRE-ELECTION BACKGROUND/);
 assert.ok(!issue.topics.some(t=>t.source==='Foreign Affairs'));
 assert.match(issue.sources.find(s=>s.publication.includes('UK edition')).status,/not an independent/);
 assert.match(issue.sources.find(s=>s.publication.includes('Weekend Magazine')).status,/only PDF pp. 1–8/);
});
