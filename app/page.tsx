"use client";

import { useEffect, useRef, useState } from "react";

import type {Category, BriefItem, CommentaryItem, Topic, OriginalReading, EditorialImage} from "../data/types";
import editorialImages from "../data/editorial-images.json";
import {editions} from "../data/editions";

const categories: Category[] = ["本周重点", "国际", "经济", "社会", "文化", "科技"];
const categoryEn: Record<Category, string> = {"本周重点": "Highlights", "国际": "World", "经济": "Economy", "社会": "Society", "文化": "Culture", "科技": "Technology"};

function EditorialScore({ score }: { score: number }) {
  return (
    <div className="editorial-score" aria-label={`Overall score ${score} out of 100`}>
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

const imageRegistry = editorialImages as Record<string, EditorialImage[]>;

function EditorialFigure({image, compact = false}: {image: EditorialImage; compact?: boolean}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <figure className={`editorial-figure editorial-${image.kind}`}>
    <img src={image.src} width={image.width} height={image.height} alt={image.captionEn} loading="lazy" decoding="async" onError={() => setFailed(true)} />
    <figcaption>
      {compact ? <details className="photo-details"><summary>Photo info</summary><span>{image.captionEn}</span>{image.attribution && <span>{image.attribution}</span>}</details> : <><span>{image.kind === "file" && "FILE PHOTO · "}{image.captionEn}</span></>}
      <span className="image-credit"><a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">{image.author}</a> · <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer">{image.license}</a> · {image.kind === "portrait" ? "Cropped, grayscale" : "Cropped"}</span>
      {!compact && image.attribution && <details className="image-attribution"><summary>Attribution</summary><span>{image.attribution}</span></details>}
    </figcaption>
  </figure>;
}

function BriefCard({ item, index }: { item: BriefItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="brief-card" id={item.id}>
      <div className="brief-copy">
        <div className="brief-lead">
        <div>
        <div className="brief-meta">
          <span className="brief-number">{String(index + 1).padStart(2, "0")}</span>
          <span className={`category-pill cat-${item.category}`}>{categoryEn[item.category]}</span>
          <span>{item.date}</span>
          {item.sourceType === "外部核查" && <span className="external-check">External check</span>}
        </div>
        <h3>{item.titleEn}</h3>
        <p className="brief-title-zh" lang="zh-CN">{item.titleZh}</p>
        </div>
        {imageRegistry[item.id]?.filter(image => image.kind === "news").map(image => <EditorialFigure key={image.src} image={image} compact />)}
        </div>
        <p className={`brief-summary${expanded ? "" : " brief-summary-preview"}`} id={`${item.id}-summary`}>{item.summaryEn}</p>
        <button className="brief-expand" aria-expanded={expanded} aria-controls={`${item.id}-summary`} onClick={() => setExpanded(!expanded)}>{expanded ? "Show less · 收起" : "Read full brief · 完整简报"}</button>
        <details className="brief-translation"><summary>中文摘要</summary><p className="brief-summary-zh" lang="zh-CN">{item.summaryZh}</p></details>
        <p className="brief-impact"><b>Why it matters</b><span lang="zh-CN">{item.why}</span></p>
        <details className="brief-why"><summary>Sources · 来源</summary>
        <p className="brief-source">{item.sourceType === "外部核查" ? "External check" : "Publication"} · {item.source}</p>
        <SourceLinks links={item.links} />
        <OriginalReadingLinks original={item.original} />
        </details>
      </div>
    </article>
  );
}

function SourceLinks({links}: {links?: {label: string; url: string}[]}) {
  if (!links?.length) return null;
  return <ul className="source-links">{links.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a></li>)}</ul>;
}

function OriginalReadingLinks({original}: {original?: OriginalReading}) {
  if (!original) return null;
  if (!original.links.length) return null;
  const access = {free: "Free to read · 免费阅读", subscription: "May require subscription · 可能需要订阅", gift: "Official gift link · 官方赠阅"};
  return <div className="original-reading" aria-label="Original reading / 原文阅读">
    {original.links.map(link => <div className="original-reading-item" key={link.url}>
      <a className="original-reading-link" href={link.url} target="_blank" rel="noopener noreferrer">
        {link.verification === "author-copy" ? "Read author copy" : "Read original"} ↗ <span>{link.publication}</span>
      </a>
      <small className={`original-access access-${link.access}`}>{access[link.access]}</small>
      {link.note && <small className="original-version-note">{link.note}</small>}
    </div>)}
  </div>;
}

function CommentaryCard({ item }: { item: CommentaryItem }) {
  return (
    <article className="commentary-card" id={item.id}>
      <div className="commentary-source">
        <span>COMMENTARY</span>
        <div className="author-portraits">{imageRegistry[item.id]?.map(image => <EditorialFigure key={image.src} image={image} />)}</div>
        <p>{item.author}</p>
        <small>{item.authorRole}</small>
        <small>{item.source} · {item.pages}</small>
      </div>
      <div className="commentary-body">
        <h3>{item.titleEn}</h3>
        <p className="commentary-title-zh" lang="zh-CN">{item.titleZh}</p>
        <OriginalReadingLinks original={item.original} />
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

function TopicCard({ topic, editionId }: { topic: Topic; editionId: string }) {
  const analysisUrl = `/analysis/${encodeURIComponent(editionId)}/${encodeURIComponent(topic.id)}/`;
  return (
    <article className={`topic-card ${topic.featured ? "is-featured" : ""}`} id={topic.id}>
      <div className="topic-card-head">
        <div>
          <div className="eyebrow-row">
            <span className={`category-pill cat-${topic.category}`}>{categoryEn[topic.category]}</span>
            {topic.deepRead && <span className="deep-pill">DEEP READ</span>}
            <span className="read-time">Original read ~{topic.readTime} min</span>
          </div>
          <h3><a className="analysis-title-link" href={analysisUrl}>{topic.title}</a></h3>
          <p className="topic-title-zh" lang="zh-CN"><a className="analysis-title-link" href={analysisUrl}>{topic.titleZh}</a></p>
          <p className="source-line">{topic.source} · {topic.issue} · {topic.pages}</p>
          {topic.author && <p className="source-line">{topic.author} · PDF p. {topic.pdfPages}</p>}
        </div>
        <EditorialScore score={topic.score} />
      </div>

      <OriginalReadingLinks original={topic.original} />
      <div className="tags" aria-label="Topic tags / 主题标签">
        {topic.tags.map(([zh, en]) => <span key={zh}>{en}<i lang="zh-CN">{zh}</i></span>)}
      </div>

      <BilingualBlock label="新闻摘要" enLabel="News Summary" zh={<p>{topic.summaryZh}</p>} en={<p>{topic.summaryEn}</p>} />

      <section className="editor-note"><h4>Why it matters · 重要性</h4><p lang="zh-CN">{topic.why}</p></section>
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
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const target = edition.topics.find(t => t.id === hash);
    if (target) {
      if (!target.featured) setActive(target.category);
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView());
    }
  }, [editionId, edition]);
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
          <a href="#highlights" onClick={() => { setActive("本周重点"); setSource("全部刊物"); setQuery(""); }}>Highlights</a>
          <a href="#commentary">Commentary</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-main">
        <div className="edition-picker"><label htmlFor="edition">Edition / 阅读期数</label><select id="edition" value={editionId} onChange={event => selectEdition(event.target.value)}>{editions.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</select></div>
        <div className="hero-kicker">{edition.period}</div>
        <h1>The Truth must<br /><em>dazzle gradually.</em></h1>
        <p className="hero-translation" lang="zh-CN">真相的光，须徐徐照亮。</p>
        <p className="hero-attribution">— Emily Dickinson</p>
        <p className="hero-lede">{edition.ledeEn}</p>
        <p className="hero-lede-zh" lang="zh-CN">{edition.lede}</p>
        <div className="hero-stats">
          <div><strong>{briefs.length}</strong><span>NEWS BRIEFS<br />新闻简报</span></div>
          <div><strong>{String(topics.length).padStart(2,"0")}</strong><span>CORE TOPICS<br />核心议题</span></div>
          <div><strong>{String(topics.filter(t => t.deepRead).length).padStart(2,"0")}</strong><span>DEEP READS<br />精读文选</span></div>
        </div>
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
            <h2>What happened this week</h2>
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
        <details className="brief-disclaimer"><summary>Coverage note · 收录范围</summary><p>{edition.scopeEn}</p></details>
      </section>

      <section className="controls" id="highlights" aria-label="Content filters">
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
          {visible.map((topic) => <TopicCard topic={topic} editionId={editionId} key={`${editionId}-${topic.id}`} />)}
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
        <div className="brand footer-brand"><span className="brand-mark">W</span><span><b>The Weekly Edit</b><small>The Truth must dazzle gradually. — Emily Dickinson</small></span></div>
        <p>Original bilingual guides to the publications provided. This is a curated selection, not complete coverage of world news.</p>
        <p>{edition.label} · Browse other editions above</p>
      </footer>
    </main>
  );
}
