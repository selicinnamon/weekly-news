import {editions} from "../../data/editions";

export const metadata = {title: "Analysis archive | The Weekly Edit"};

export default function AnalysisArchive() {
  return <main className="analysis-page"><header className="analysis-header"><a href="/">← The Weekly Edit</a></header><div className="analysis-article"><h1>Analysis archive</h1>{editions.map(edition => <section key={edition.id}><h2>{edition.label}</h2><ul>{edition.topics.map(topic => <li key={topic.id}><a href={`/analysis/${encodeURIComponent(edition.id)}/${encodeURIComponent(topic.id)}/`}>{topic.title}<span lang="zh-CN"> · {topic.titleZh}</span></a></li>)}</ul></section>)}</div></main>;
}
