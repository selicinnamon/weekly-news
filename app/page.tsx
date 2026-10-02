"use client";

import { useEffect, useRef, useState } from "react";

import type {Category, BriefItem, CommentaryItem, Topic} from "../data/types";
import {editions} from "../data/editions";

const categories: Category[] = ["本周重点", "国际", "经济", "社会", "文化", "科技"];
const categoryEn: Record<Category, string> = {"本周重点": "Highlights", "国际": "World", "经济": "Economy", "社会": "Society", "文化": "Culture", "科技": "Technology"};

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties} aria-label={`Overall score ${score} out of 100`}>
      <span>{score}</span>
      <small>score</small>
    </div>
  );
}

function BilingualBlock({ label, enLabel, zh, en }: { label: string; enLabel: string; zh: React.ReactNode; en: React.ReactNode }) {
  return (
    <section className="bilingual-block">
      <h4>{enLabel}<span>{label}</span></h4>
      <div className="en-copy">{en}</div>
      <div className="zh-copy" lang="zh-CN"><small>中文对照</small>{zh}</div>
    </section>
  );
}

function BriefCard({ item, index }: { item: BriefItem; index: number }) {
  return (
    <article className="brief-card" id={item.id}>
      <div className="brief-number">{String(index + 1).padStart(2, "0")}</div>
      <div className="brief-copy">
        <div className="brief-meta">
          <span className={`category-pill cat-${item.category}`}>{categoryEn[item.category]}</span>
          <span>{item.date}</span>
          {item.sourceType === "外部核查" && <span className="external-check">External check</span>}
        </div>
        <h3>{item.titleEn}</h3>
        <p className="brief-title-zh" lang="zh-CN">{item.titleZh}</p>
        <p className="brief-summary">{item.summaryEn}</p>
        <p className="brief-summary-zh" lang="zh-CN">{item.summaryZh}</p>
        <details className="brief-why"><summary>Why it matters · 编辑说明</summary><p lang="zh-CN">{item.why}</p></details>
        <p className="brief-source">{item.sourceType === "外部核查" ? "External check" : "Publication"} · {item.source}</p>
        <SourceLinks links={item.links} />
      </div>
    </article>
  );
}

function SourceLinks({links}: {links?: {label: string; url: string}[]}) {
  if (!links?.length) return null;
  return <ul className="source-links">{links.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a></li>)}</ul>;
}

function CommentaryCard({ item }: { item: CommentaryItem }) {
  return (
    <article className="commentary-card" id={item.id}>
      <div className="commentary-source">
        <span>COMMENTARY</span>
        <p>{item.author}</p>
        <small>{item.authorRole}</small>
        <small>{item.source} · {item.pages}</small>
      </div>
      <div className="commentary-body">
        <h3>{item.titleEn}</h3>
        <p className="commentary-title-zh" lang="zh-CN">{item.titleZh}</p>
        <details className="commentary-position"><summary>Author’s standpoint · 作者立场</summary><p lang="zh-CN">{item.position}</p></details>
        {item.tags && <div className="tags">{item.tags.map(([zh,en]) => <span key={zh}>{en}<i lang="zh-CN">{zh}</i></span>)}</div>}
        <BilingualBlock label="核心主张" enLabel="Central Claim" zh={<p>{item.thesisZh}</p>} en={<p>{item.thesisEn}</p>} />
        {item.backgroundZh && <BilingualBlock label="背景补充" enLabel="Background" zh={<p>{item.backgroundZh}</p>} en={<p>{item.backgroundEn}</p>} />}
        {item.caseEn ? <BilingualBlock label="论点梳理" enLabel="Argument Outline" zh={<ol>{item.caseZh.map(p => <li key={p}>{p}</li>)}</ol>} en={<ol>{item.caseEn.map(p => <li key={p}>{p}</li>)}</ol>} /> : <div className="commentary-argument">
          <b>Argument path · 论证路径</b>
          <ol>{item.caseZh.map((point) => <li key={point}>{point}</li>)}</ol>
        </div>}
        {item.evidenceZh && <BilingualBlock label="证据分析" enLabel="Evidence Assessment" zh={<p>{item.evidenceZh}</p>} en={<p>{item.evidenceEn}</p>} />}
        <div className="commentary-test">
          <div><b>Why this view matters · 观点价值</b><p lang="zh-CN">{item.value}</p></div>
          <div><b>The strongest challenge · 反方检验</b><p lang="zh-CN">{item.challenge}</p></div>
        </div>
        <div className="commentary-takeaway"><b>Editorial takeaway · 编辑结语</b><p lang="zh-CN">{item.takeaway}</p></div>
        <SourceLinks links={item.links} />
      </div>
    </article>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <article className={`topic-card ${topic.featured ? "is-featured" : ""}`} id={topic.id}>
      <div className="topic-card-head">
        <div>
          <div className="eyebrow-row">
            <span className={`category-pill cat-${topic.category}`}>{categoryEn[topic.category]}</span>
            {topic.deepRead && <span className="deep-pill">DEEP READ</span>}
            <span className="read-time">Original read ~{topic.readTime} min</span>
          </div>
          <h3>{topic.title}</h3>
          <p className="topic-title-zh" lang="zh-CN">{topic.titleZh}</p>
          <p className="source-line">{topic.source} · {topic.issue} · {topic.pages}</p>
          {topic.author && <p className="source-line">{topic.author} · PDF p. {topic.pdfPages}</p>}
        </div>
        <ScoreRing score={topic.score} />
      </div>

      <div className="tags" aria-label="Topic tags / 主题标签">
        {topic.tags.map(([zh, en]) => <span key={zh}>{en}<i lang="zh-CN">{zh}</i></span>)}
      </div>

      <BilingualBlock label="新闻摘要" enLabel="News Summary" zh={<p>{topic.summaryZh}</p>} en={<p>{topic.summaryEn}</p>} />

      <details className="editor-note"><summary>Why this read matters · 推荐理由</summary><p lang="zh-CN">{topic.why}</p></details>

      <details className="analysis-drawer">
        <summary><span>Explore the full analysis</span><span className="drawer-meta">Background · Argument · Evidence · Limits</span></summary>
        <div className="analysis-content">
          <BilingualBlock label="背景补充" enLabel="Background" zh={<p>{topic.backgroundZh}</p>} en={<p>{topic.backgroundEn}</p>} />
          <BilingualBlock
            label="论点梳理"
            enLabel="Argument Outline"
            zh={<ol>{topic.argumentZh.map((x) => <li key={x}>{x}</li>)}</ol>}
            en={<ol>{topic.argumentEn.map((x) => <li key={x}>{x}</li>)}</ol>}
          />
          <BilingualBlock label="证据分析" enLabel="Evidence Assessment" zh={<p>{topic.evidenceZh}</p>} en={<p>{topic.evidenceEn}</p>} />
          {topic.perspective && <div className="perspective"><b>Across publications · 跨刊视角</b><p lang="zh-CN">{topic.perspective}</p></div>}
          <SourceLinks links={topic.links} />
          <div className="limits"><b>Reading caveat · 阅读时留意</b><p lang="zh-CN">{topic.limits}</p></div>
          <div className="score-breakdown">
            <span>News significance <b>{topic.importance}/60</b></span>
            <span>Article quality <b>{topic.quality}/40</b></span>
          </div>
        </div>
      </details>
    </article>
  );
}

export default function Home() {
  const [editionId, setEditionId] = useState(editions[0].id);
  const edition = editions.find(item => item.id === editionId) ?? editions[0];
  const {briefs, topics, commentary} = edition;
  const briefRail = useRef<HTMLDivElement>(null);
  const [briefIndex, setBriefIndex] = useState(0);
  const [hasNextBrief, setHasNextBrief] = useState(true);
  const [active, setActive] = useState<Category>("本周重点");
  const [source, setSource] = useState("全部刊物");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const sync = () => {
      const id = new URL(window.location.href).searchParams.get("edition");
      setEditionId(editions.some(e => e.id === id) ? id! : editions[0].id);
      setActive("本周重点"); setSource("全部刊物"); setQuery("");
      setBriefIndex(0); setHasNextBrief(true); briefRail.current?.scrollTo({left: 0});
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const selectEdition = (id: string) => {
    setEditionId(id); setActive("本周重点"); setSource("全部刊物"); setQuery("");
    setBriefIndex(0); setHasNextBrief(true); briefRail.current?.scrollTo({left: 0});
    const url = new URL(window.location.href);
    url.searchParams.set("edition", id); url.hash = "top";
    window.history.pushState({}, "", url);
  };
  const publications = [...new Set(topics.flatMap(t => t.publications ?? [t.source]))];
  const slideBrief = (direction: number) => {
    const rail = briefRail.current;
    const card = rail?.querySelector<HTMLElement>(".brief-card");
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).gap) || 0;
    rail.scrollBy({left: direction * (card.offsetWidth + gap), behavior: "smooth"});
  };
  const updateBriefIndex = () => {
    const rail = briefRail.current;
    const card = rail?.querySelector<HTMLElement>(".brief-card");
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).gap) || 0;
    setBriefIndex(Math.min(briefs.length - 1, Math.round(rail.scrollLeft / (card.offsetWidth + gap))));
    setHasNextBrief(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2);
  };

  const visible = topics.filter((topic) => {
    const categoryMatch = active === "本周重点" ? topic.featured : topic.category === active || topic.tags.some(([zh]) => zh === active);
    const sourceMatch = source === "全部刊物" || (topic.publications ?? [topic.source]).includes(source);
    const haystack = `${topic.title} ${topic.titleZh} ${topic.summaryZh} ${topic.summaryEn} ${topic.tags.flat().join(" ")}`.toLowerCase();
    return categoryMatch && sourceMatch && haystack.includes(query.toLowerCase());
  });

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="The Weekly Edit home">
          <span className="brand-mark">W</span>
          <span><b>The Weekly Edit</b><small>ENGLISH FIRST · 中英双语</small></span>
        </a>
        <div className="header-actions">
          <span className="edition-status"><i /> {editionId === editions[0].id ? "CURRENT ISSUE" : "ARCHIVE"}</span>
          <a href="#brief">Brief</a>
          <a href="#commentary">Commentary</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="edition-picker"><label htmlFor="edition">Edition / 阅读期数</label><select id="edition" value={editionId} onChange={event => selectEdition(event.target.value)}>{editions.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</select></div>
        <div className="hero-kicker">{edition.period}</div>
        <h1>Read less.<br /><em>Understand more.</em></h1>
        <p className="hero-translation" lang="zh-CN">少读一点，看懂更多。</p>
        <p className="hero-lede">{edition.ledeEn}</p>
        <p className="hero-lede-zh" lang="zh-CN">{edition.lede}</p>
        <div className="hero-stats">
          <div><strong>{briefs.length}</strong><span>NEWS BRIEFS<br />新闻简报</span></div>
          <div><strong>{String(topics.length).padStart(2,"0")}</strong><span>CORE TOPICS<br />核心议题</span></div>
          <div><strong>{String(topics.filter(t => t.deepRead).length).padStart(2,"0")}</strong><span>DEEP READS<br />精读文选</span></div>
        </div>
        <div className="hero-aside">
          <span>THIS WEEK&apos;S THREAD</span>
          <p>{edition.observationEn}</p>
          <small lang="zh-CN">{edition.observation}</small>
        </div>
      </section>

      <section className="weekly-brief" id="brief">
        <div className="brief-heading">
          <div>
            <span>THE WEEK IN BRIEF · ABOUT 8 MINUTES</span>
            <h2>What happened<br />this week</h2>
            <p className="heading-translation" lang="zh-CN">本周新闻简报</p>
          </div>
          <div className="brief-navigation" aria-label="Brief navigation">
            <span>{String(briefIndex + 1).padStart(2, "0")} / {String(briefs.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => slideBrief(-1)} disabled={briefIndex === 0} aria-label="Previous brief">←</button>
            <button type="button" onClick={() => slideBrief(1)} disabled={!hasNextBrief} aria-label="Next brief">→</button>
          </div>
        </div>
        <div className="brief-list" ref={briefRail} onScroll={updateBriefIndex} role="region" aria-roledescription="carousel" aria-label="The week in brief">
          {briefs.map((item, index) => <BriefCard item={item} index={index} key={item.id} />)}
        </div>
        <p className="brief-disclaimer">{edition.scopeEn}</p>
      </section>

      <section className="controls" aria-label="Content filters">
        <nav className="category-tabs">
          {categories.map((category) => (
            <button key={category} className={active === category ? "active" : ""} onClick={() => setActive(category)}>{categoryEn[category]}<small lang="zh-CN">{category}</small></button>
          ))}
        </nav>
        <div className="filter-tools">
          <label className="search-box">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, summaries or tags / 搜索内容" aria-label="Search content" />
          </label>
          <select value={source} onChange={(event) => setSource(event.target.value)} aria-label="Filter by publication">
            <option value="全部刊物">All publications</option>
            {publications.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </section>

      <section className="content-shell">
        <div className="section-heading">
          <div><span>{active === "本周重点" ? "CURATED THIS EDITION" : "BROWSE BY FIELD"}</span><h2>{categoryEn[active]}</h2><small className="heading-translation" lang="zh-CN">{active}</small></div>
          <p>{visible.length} topics · English first, Chinese below</p>
        </div>
        <div className="topic-grid">
          {visible.map((topic) => <TopicCard topic={topic} key={`${editionId}-${topic.id}`} />)}
        </div>
        {visible.length === 0 && <div className="empty-state"><b>No matching stories</b><p>Try clearing your search or changing the publication and field filters.</p></div>}
      </section>

      <section className="commentary" id="commentary">
        <div className="commentary-heading">
          <div><span>COMMENTARY · 观点与争鸣</span><h2>Read the stance.<br />Test the claim.</h2><p className="heading-translation" lang="zh-CN">先辨认立场，再衡量观点。</p></div>
          <p>Opinion is not a footnote to reporting. These essays identify the writer’s position, the insight it offers, and the evidence that could challenge it.</p>
        </div>
        <div className="commentary-list">
          {commentary.map((item) => <CommentaryCard item={item} key={item.id} />)}
        </div>
      </section>

      <section className="reading-list">
        <div className="reading-intro">
          <span>DEEP READING · 精读路线</span>
          <h2>{topics.filter(t => t.deepRead).length} reads.<br />{topics.filter(t => t.deepRead).reduce((n,t) => n+t.readTime,0)} minutes.</h2>
          <p>{edition.readingNoteEn}</p>
          <p className="reading-note-zh" lang="zh-CN">{edition.readingNote}</p>
        </div>
        <ol>
          {topics.filter((topic) => topic.deepRead).map((topic, index) => (
            <li key={topic.id}>
              <a href={`#${topic.id}`} onClick={() => {setActive("本周重点"); setSource("全部刊物"); setQuery(""); requestAnimationFrame(() => document.getElementById(topic.id)?.scrollIntoView());}}>
                <span>0{index + 1}</span>
                <div><b>{topic.title}</b><small lang="zh-CN">{topic.titleZh}</small><small>{topic.source} · {topic.pages}</small></div>
                <em>{topic.readTime}′</em>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">W</span><span><b>The Weekly Edit</b><small>Read less. Understand more.</small></span></div>
        <p>Original bilingual guides to the publications provided. This is a curated selection, not complete coverage of world news.</p>
        <p>{edition.label} · Browse other editions above</p>
      </footer>
    </main>
  );
}
