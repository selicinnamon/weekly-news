import {notFound} from "next/navigation";
import {editions} from "../../../../data/editions";
import type {OriginalReading} from "../../../../data/types";

type Props = {params: Promise<{edition: string; topic: string}>};

function Block({title, zhTitle, en, zh}: {title: string; zhTitle: string; en: React.ReactNode; zh: React.ReactNode}) {
  return <section className="bilingual-block"><h2>{title}<span lang="zh-CN">{zhTitle}</span></h2><div className="en-copy">{en}</div><div className="zh-copy" lang="zh-CN"><small>中文对照</small>{zh}</div></section>;
}

function Originals({original}: {original?: OriginalReading}) {
  if (!original?.links.length) return null;
  const access = {free: "Free to read · 免费阅读", subscription: "May require subscription · 可能需要订阅", gift: "Official gift link · 官方赠阅"};
  return <div className="original-reading" aria-label="Original reading / 原文阅读">{original.links.map(link => <div className="original-reading-item" key={link.url}><a className="original-reading-link" href={link.url} target="_blank" rel="noopener noreferrer">{link.verification === "author-copy" ? "Read author copy" : "Read original"} ↗ {link.publication}</a><small className="original-access">{access[link.access]}</small>{link.note && <small className="original-version-note">{link.note}</small>}</div>)}</div>;
}

export async function generateMetadata({params}: Props) {
  const p = await params;
  const topic = editions.find(e => e.id === p.edition)?.topics.find(t => t.id === p.topic);
  return {title: topic ? `${topic.title} | The Weekly Edit` : "Article not found | The Weekly Edit", description: topic?.summaryEn};
}

export default async function AnalysisPage({params}: Props) {
  const p = await params;
  const edition = editions.find(e => e.id === p.edition);
  const topic = edition?.topics.find(t => t.id === p.topic);
  if (!edition || !topic) notFound();
  const back = `/?edition=${encodeURIComponent(edition.id)}#${encodeURIComponent(topic.id)}`;
  return <main className="analysis-page">
    <header className="analysis-header"><a className="brand" href="/"><span className="brand-mark">W</span><span><b>The Weekly Edit</b></span></a><a href={back}>← Back to edition · 返回原期</a></header>
    <article className="analysis-article">
      <p className="analysis-kicker">FULL ANALYSIS · {edition.label}</p>
      <h1>{topic.title}</h1><p className="analysis-title-zh" lang="zh-CN">{topic.titleZh}</p>
      <p className="source-line">{topic.source} · {topic.issue} · {topic.pages}</p>
      {topic.author && <p className="source-line">{topic.author} · PDF p. {topic.pdfPages}</p>}
      <Originals original={topic.original} />
      <div className="tags" aria-label="Topic tags / 主题标签">{topic.tags.map(([zh,en]) => <span key={zh}>{en}<i lang="zh-CN">{zh}</i></span>)}</div>
      <section className="editor-note"><h2>Why it matters · 重要性</h2><p lang="zh-CN">{topic.why}</p></section>
      <Block title="News Summary" zhTitle="新闻摘要" en={<p>{topic.summaryEn}</p>} zh={<p>{topic.summaryZh}</p>} />
      <Block title="Background" zhTitle="背景补充" en={<p>{topic.backgroundEn}</p>} zh={<p>{topic.backgroundZh}</p>} />
      <Block title="Argument Outline" zhTitle="论点梳理" en={<ol>{topic.argumentEn.map(x => <li key={x}>{x}</li>)}</ol>} zh={<ol>{topic.argumentZh.map(x => <li key={x}>{x}</li>)}</ol>} />
      <Block title="Evidence Assessment" zhTitle="证据分析" en={<p>{topic.evidenceEn}</p>} zh={<p>{topic.evidenceZh}</p>} />
      {topic.perspective && <section className="perspective"><h2>Across publications · 跨刊视角</h2><p lang="zh-CN">{topic.perspective.replaceAll("下方社论", "本期社论")}</p></section>}
      <section className="limits"><h2>Reading caveat · 阅读时留意</h2><p lang="zh-CN">{topic.limits}</p></section>
      {!!topic.links?.length && <ul className="source-links">{topic.links.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a></li>)}</ul>}
      <details className="analysis-scoring"><summary>Editorial assessment · 编辑评分</summary><p>News significance {topic.importance}/60 · Article quality {topic.quality}/40 · Total {topic.score}/100</p></details>
      <nav className="analysis-footer"><a href={back}>← Back to edition · 返回原期</a></nav>
    </article>
  </main>;
}
