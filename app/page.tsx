"use client";

import { useEffect, useState } from "react";

import type {Category, BriefItem, CommentaryItem, Topic} from "../data/types";
import {editions} from "../data/editions";

const categories: Category[] = ["本周重点", "国际", "经济", "社会", "文化", "科技"];

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="score-ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties} aria-label={`综合评分 ${score} 分`}>
      <span>{score}</span>
      <small>综合</small>
    </div>
  );
}

function BilingualBlock({ label, enLabel, zh, en }: { label: string; enLabel: string; zh: React.ReactNode; en: React.ReactNode }) {
  return (
    <section className="bilingual-block">
      <h4>{label}<span>{enLabel}</span></h4>
      <div className="zh-copy">{zh}</div>
      <details>
        <summary>Read in English <span>＋</span></summary>
        <div className="en-copy">{en}</div>
      </details>
    </section>
  );
}

function BriefCard({ item, index }: { item: BriefItem; index: number }) {
  return (
    <article className="brief-card" id={item.id}>
      <div className="brief-number">{String(index + 1).padStart(2, "0")}</div>
      <div className="brief-copy">
        <div className="brief-meta">
          <span className={`category-pill cat-${item.category}`}>{item.category}</span>
          <span>{item.date}</span>
          {item.sourceType === "外部核查" && <span className="external-check">外部核查</span>}
        </div>
        <h3>{item.titleZh}</h3>
        <p className="brief-title-en">{item.titleEn}</p>
        <p className="brief-summary">{item.summaryZh}</p>
        <details className="brief-english">
          <summary>English brief <span>＋</span></summary>
          <p>{item.summaryEn}</p>
        </details>
        <div className="brief-why"><b>为什么重要</b><span>{item.why}</span></div>
        <p className="brief-source">{item.sourceType ?? "刊物来源"} · {item.source}</p>
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
        <span>刊物评论选读</span>
        <p>{item.author}</p>
        <small>{item.authorRole}</small>
        <small>{item.source} · {item.pages}</small>
      </div>
      <div className="commentary-body">
        <p className="commentary-position">立场说明 · {item.position}</p>
        <h3>{item.titleZh}</h3>
        <p className="commentary-title-en">{item.titleEn}</p>
        {item.tags && <div className="tags">{item.tags.map(([zh,en]) => <span key={zh}>{zh}<i>{en}</i></span>)}</div>}
        <BilingualBlock label="核心主张" enLabel="Central Claim" zh={<p>{item.thesisZh}</p>} en={<p>{item.thesisEn}</p>} />
        {item.backgroundZh && <BilingualBlock label="背景补充" enLabel="Background" zh={<p>{item.backgroundZh}</p>} en={<p>{item.backgroundEn}</p>} />}
        {item.caseEn ? <BilingualBlock label="论点梳理" enLabel="Argument Outline" zh={<ol>{item.caseZh.map(p => <li key={p}>{p}</li>)}</ol>} en={<ol>{item.caseEn.map(p => <li key={p}>{p}</li>)}</ol>} /> : <div className="commentary-argument">
          <b>论证路径</b>
          <ol>{item.caseZh.map((point) => <li key={point}>{point}</li>)}</ol>
        </div>}
        {item.evidenceZh && <BilingualBlock label="证据分析" enLabel="Evidence Assessment" zh={<p>{item.evidenceZh}</p>} en={<p>{item.evidenceEn}</p>} />}
        <div className="commentary-test">
          <div><b>这个观点为什么有价值</b><p>{item.value}</p></div>
          <div><b>最强反方检验 · 编辑判断</b><p>{item.challenge}</p></div>
        </div>
        <div className="commentary-takeaway"><b>编辑结语</b><p>{item.takeaway}</p></div>
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
            <span className={`category-pill cat-${topic.category}`}>{topic.category}</span>
            {topic.deepRead && <span className="deep-pill">精读文选</span>}
            <span className="read-time">原刊阅读约 {topic.readTime} 分钟</span>
          </div>
          <h3>{topic.titleZh}</h3>
          <p className="original-title">{topic.title}</p>
          <p className="source-line">{topic.source} · {topic.issue} · {topic.pages}</p>
          {topic.author && <p className="source-line">{topic.author} · {topic.genre} · PDF 第 {topic.pdfPages} 页</p>}
        </div>
        <ScoreRing score={topic.score} />
      </div>

      <div className="tags" aria-label="主题标签">
        {topic.tags.map(([zh, en]) => <span key={zh}>{zh}<i>{en}</i></span>)}
      </div>

      <BilingualBlock label="新闻摘要" enLabel="News Summary" zh={<p>{topic.summaryZh}</p>} en={<p>{topic.summaryEn}</p>} />

      <div className="editor-note">
        <span>为什么值得读</span>
        <p>{topic.why}</p>
      </div>

      <details className="analysis-drawer">
        <summary><span>展开完整分析</span><span className="drawer-meta">背景 · 论点 · 证据 · 局限</span></summary>
        <div className="analysis-content">
          <BilingualBlock label="背景补充" enLabel="Background" zh={<p>{topic.backgroundZh}</p>} en={<p>{topic.backgroundEn}</p>} />
          <BilingualBlock
            label="论点梳理"
            enLabel="Argument Outline"
            zh={<ol>{topic.argumentZh.map((x) => <li key={x}>{x}</li>)}</ol>}
            en={<ol>{topic.argumentEn.map((x) => <li key={x}>{x}</li>)}</ol>}
          />
          <BilingualBlock label="证据分析" enLabel="Evidence Assessment" zh={<p>{topic.evidenceZh}</p>} en={<p>{topic.evidenceEn}</p>} />
          {topic.perspective && <div className="perspective"><b>跨刊 / 文体视角</b><p>{topic.perspective}</p></div>}
          <SourceLinks links={topic.links} />
          <div className="limits"><b>阅读时留意</b><p>{topic.limits}</p></div>
          <div className="score-breakdown">
            <span>新闻重要性 <b>{topic.importance}/60</b></span>
            <span>文章质量 <b>{topic.quality}/40</b></span>
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
  const [active, setActive] = useState<Category>("本周重点");
  const [source, setSource] = useState("全部刊物");
  const [query, setQuery] = useState("");
  useEffect(() => {
    const sync = () => {
      const id = new URL(window.location.href).searchParams.get("edition");
      setEditionId(editions.some(e => e.id === id) ? id! : editions[0].id);
      setActive("本周重点"); setSource("全部刊物"); setQuery("");
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const selectEdition = (id: string) => {
    setEditionId(id); setActive("本周重点"); setSource("全部刊物"); setQuery("");
    const url = new URL(window.location.href);
    url.searchParams.set("edition", id); url.hash = "top";
    window.history.pushState({}, "", url);
  };
  const publications = [...new Set(topics.flatMap(t => t.publications ?? [t.source]))];

  const visible = topics.filter((topic) => {
    const categoryMatch = active === "本周重点" ? topic.featured : topic.category === active || topic.tags.some(([zh]) => zh === active);
    const sourceMatch = source === "全部刊物" || (topic.publications ?? [topic.source]).includes(source);
    const haystack = `${topic.title} ${topic.titleZh} ${topic.summaryZh} ${topic.summaryEn} ${topic.tags.flat().join(" ")}`.toLowerCase();
    return categoryMatch && sourceMatch && haystack.includes(query.toLowerCase());
  });

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="The Weekly Edit 首页">
          <span className="brand-mark">W</span>
          <span><b>The Weekly Edit</b><small>英文刊物双语精选</small></span>
        </a>
        <div className="header-actions">
          <span className="edition-status"><i /> {edition.status}</span>
          <a href="#brief">本周简报</a>
          <a href="#commentary">观点</a>
          <a href="#method">筛选方法</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="edition-picker"><label htmlFor="edition">阅读期数 / Edition</label><select id="edition" value={editionId} onChange={event => selectEdition(event.target.value)}>{editions.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}</select><a href="#sources">来源与编辑记录 ↓</a></div>
        <div className="hero-kicker">{edition.period}</div>
        <h1>少读一点，<br /><em>看懂更多。</em></h1>
        <p className="hero-lede">{edition.lede}</p>
        <div className="hero-stats">
          <div><strong>{briefs.length}</strong><span>新闻简报<br />Weekly brief</span></div>
          <div><strong>{String(topics.length).padStart(2,"0")}</strong><span>核心议题<br />Core topics</span></div>
          <div><strong>{String(topics.filter(t => t.deepRead).length).padStart(2,"0")}</strong><span>精读文选<br />Deep reads</span></div>
        </div>
        <div className="hero-aside">
          <span>本期观察</span>
          <p>{edition.observation}</p>
          <small>EDITOR&apos;S THREAD / 编辑线索</small>
        </div>
      </section>

      <section className="weekly-brief" id="brief">
        <div className="brief-heading">
          <div>
            <span>THE WEEK IN BRIEF · 约 8 分钟</span>
            <h2>本周新闻简报</h2>
          </div>
          <div className="brief-note">
            <b>先建立全局，再进入细节</b>
            <p>按公共重要性排序。事实、来源与不确定性分开呈现；英文采用克制的国际新闻简讯体。</p>
          </div>
        </div>
        <div className="brief-list">
          {briefs.map((item, index) => <BriefCard item={item} index={index} key={item.id} />)}
        </div>
        <p className="brief-disclaimer">{edition.scope}</p>
      </section>

      <section className="controls" aria-label="内容筛选">
        <nav className="category-tabs">
          {categories.map((category) => (
            <button key={category} className={active === category ? "active" : ""} onClick={() => setActive(category)}>{category}</button>
          ))}
        </nav>
        <div className="filter-tools">
          <label className="search-box">
            <span>⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索中英文标题、摘要或标签" aria-label="搜索内容" />
          </label>
          <select value={source} onChange={(event) => setSource(event.target.value)} aria-label="按刊物筛选">
            <option>全部刊物</option>
            {publications.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
      </section>

      <section className="content-shell">
        <div className="section-heading">
          <div><span>{active === "本周重点" ? "CURATED THIS EDITION" : "BROWSE BY FIELD"}</span><h2>{active}</h2></div>
          <p>{visible.length} 个议题 · 中文默认，英文可展开</p>
        </div>
        <div className="topic-grid">
          {visible.map((topic) => <TopicCard topic={topic} key={`${editionId}-${topic.id}`} />)}
        </div>
        {visible.length === 0 && <div className="empty-state"><b>没有找到匹配内容</b><p>试试清除搜索词，或切换刊物与领域。</p></div>}
      </section>

      <section className="commentary" id="commentary">
        <div className="commentary-heading">
          <div><span>COMMENTARY · 观点与争鸣</span><h2>先辨认立场，<br />再衡量观点。</h2></div>
          <p>评论不是事实报道的附注。这里说明作者从哪里出发、为何值得听，以及什么证据可能推翻它。</p>
        </div>
        <div className="commentary-list">
          {commentary.map((item) => <CommentaryCard item={item} key={item.id} />)}
        </div>
      </section>

      <section className="reading-list">
        <div className="reading-intro">
          <span>DEEP READING · 精读路线</span>
          <h2>把 {topics.filter(t => t.deepRead).reduce((n,t) => n+t.readTime,0)} 分钟，<br />花在这{topics.filter(t => t.deepRead).length === 3 ? "三" : "几"}篇上</h2>
          <p>{edition.readingNote}</p>
        </div>
        <ol>
          {topics.filter((topic) => topic.deepRead).map((topic, index) => (
            <li key={topic.id}>
              <a href={`#${topic.id}`} onClick={() => {setActive("本周重点"); setSource("全部刊物"); setQuery(""); requestAnimationFrame(() => document.getElementById(topic.id)?.scrollIntoView());}}>
                <span>0{index + 1}</span>
                <div><b>{topic.titleZh}</b><small>{topic.source} · {topic.pages}</small></div>
                <em>{topic.readTime}′</em>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="method" id="method">
        <div className="method-title"><span>HOW IT WORKS</span><h2>不是摘要堆叠，<br />而是一套编辑判断。</h2></div>
        <div className="method-grid">
          <div><i>01</i><b>全刊扫描</b><p>识别事件、文章边界、作者与页码，建立一周候选池。</p></div>
          <div><i>02</i><b>核验与聚类</b><p>补查重大遗漏，合并重复报道，保留来源与证据差异。</p></div>
          <div><i>03</i><b>事实与观点分离</b><p>事实、分析、预测和价值判断分别标示，不制造虚假平衡。</p></div>
          <div><i>04</i><b>双语一致性</b><p>中英文共用事实底稿，逐项检查归属、数字和不确定性。</p></div>
        </div>
        <div className="weight-bar">
          <span>个人兴趣权重</span>
          <div><i style={{ width: "100%" }}>国际</i><i style={{ width: "82%" }}>经济</i><i style={{ width: "64%" }}>社会</i><i style={{ width: "46%" }}>文化</i><i style={{ width: "28%" }}>科技</i></div>
        </div>
      </section>

      <section className="source-ledger" id="sources">
        <div className="section-heading"><div><span>EDITORIAL RECORD</span><h2>来源与编辑记录</h2></div><p>{edition.sources.length ? `${edition.sources.length} 份 PDF · ${edition.sources.reduce((n,s) => n+s.pages,0)} 页材料（含广告及扫描页）` : "历史样刊"}</p></div>
        <p>{edition.scope}</p>
        {edition.sources.length > 0 && <details><summary>展开来源清单与解析范围</summary><ul>{edition.sources.map(s => <li key={`${s.publication}-${s.issue}`}><b>{s.publication} · {s.issue} · {s.pages} pages</b><p>{s.status}</p></li>)}</ul></details>}
        {edition.audit && <details><summary>查看 10 篇重点候选的编辑评分与去向</summary><p>重要性 60 分＋质量 40 分，分数是编辑判断而非客观测量；报道、分析与评论先按文体评价。同档参考国际、经济、社会、文化、科技的兴趣顺序。下表不是已由用户验收的排名。</p><ol>{edition.audit.map(a => <li key={a.article}><b>{a.article}</b><p>{a.genre} · 重要性 {a.importance}/60 · 质量 {a.quality}/40 · {a.decision}</p></li>)}</ol></details>}
        <p className="ledger-note">英文为原创转述，保留消息归属、范围与不确定性；不模拟某刊的独有文风。链接用于有限核查，不能代替独立调查。原刊 PDF 不随网站公开；来源页码供你在自有文件中定位。阅读时间为估计，80% 推荐满意度仍待你的反馈检验。</p>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">W</span><span><b>The Weekly Edit</b><small>Read less. Understand more.</small></span></div>
        <p>原创双语导读，仅代表所提供刊物并经有限核查后的编辑结果，不构成完整新闻覆盖。</p>
        <p>{edition.label} · 历史各期可在页首切换</p>
      </footer>
    </main>
  );
}
