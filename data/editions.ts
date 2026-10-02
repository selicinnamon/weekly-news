import type {Edition} from "./types";
import current from "./editions/2026-09-27.json";
import {briefs, topics, commentary} from "./editions/pilot";

export const editions: Edition[] = [current as Edition, {
  id: "pilot",
  label: "历史样刊 · 2026.08.15–09.07",
  period: "PILOT EDITION · 2026.08.15 — 09.07",
  status: "历史样刊（原样保留）",
  lede: "从 7 期英文刊物、618 页内容中，先回答世界发生了什么，再解释这些事件意味着什么。",
  ledeEn: "A pilot selection from English-language publications: a concise briefing, eight deeper stories and three selected reads.",
  observation: "开放社会正在同时面对三种压力：边界收紧、公共信任下降，以及人类判断力被新媒介重新塑造。",
  observationEn: "Open societies face pressure from tighter borders, declining public trust and new media that reshape human judgment.",
  scope: "历史跨期样刊，仅覆盖当时样本，不属于本周新闻。本次未重新核验其中的旧事实。",
  scopeEn: "An archived pilot covering its original sample publications; it is not a report on the current week.",
  readingNote: "历史样刊的原有阅读路线。页码对应原刊印刷页码。",
  readingNoteEn: "A reading route through the archived pilot. Page references are to the printed publications.",
  briefs, topics, commentary, sources: [],
}];
