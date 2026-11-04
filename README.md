# The Weekly Edit

An English-first bilingual news digest: what happened, why it matters, and how to weigh the arguments.

以英语为先、中英对照的新闻周报：了解发生了什么、为什么重要，以及如何衡量不同观点。

**[Read the latest edition →](https://weekly-news-dc2.pages.dev/)**

> The Truth must dazzle gradually. — Emily Dickinson
>
> 真相的光，须徐徐照亮。

## Why this exists · 项目初衷

Inspired by the public-service ideal in *The Newsroom*, The Weekly Edit began with a personal need: a thoughtful, multi-source way to understand the world without reading every publication cover to cover.

The aim is not simply to read less. It is to see events in context, recognise competing perspectives, and make better-informed decisions. This is an AI-assisted editorial experiment, not a comprehensive news service or a claim to a view without bias.

受《新闻编辑室》中新闻公共服务理念的启发，这个项目始于一个个人需求：没有时间通读所有刊物，但仍希望通过多源、有水准的报道理解世界。

目标不只是节省阅读时间，而是建立背景、辨认立场、衡量证据，为自己的判断与路线规划提供参考。这是一个 AI 辅助的新闻编辑实验，不是覆盖全球新闻的完整通讯社，也不声称拥有不带立场的全知视角。

## Inside each edition · 每期内容

- **Brief** — The week's events in a horizontal reading rail, with full English briefs, expandable Chinese summaries and concise explanations of their significance.
  本周发生了什么：完整英文简报、可展开的中文摘要，以及简洁的影响分析。
- **Highlights** — Selected reporting across world affairs, economy, society, culture and technology. Article titles lead to standalone bilingual analysis pages.
  五个领域的重点报道；点击文章标题，进入独立的双语分析页。
- **Commentary** — The author's position, supporting arguments, evidence, value, limitations and strongest challenges.
  观点与争鸣：交代作者立场、论证证据、观点价值、局限与反方检验。
- **Deep Reading** — A short reading route into selected original articles, with publication details and page references.
  精读路线：精选值得投入时间的原文，保留刊物信息与建议阅读页码。

Readers can switch editions and filter Highlights by field, publication or search terms. Verified original-article links lead to official publication pages or author-hosted versions; access may require a subscription.

可切换历史期数，并按领域、刊物或关键词筛选重点内容。已核实的原文链接跳转至刊物官方页面或作者官网版本；部分内容需要订阅。

## Editorial approach · 编辑原则

- **Events before trends in the Brief.** Major developments should not disappear simply because a longer analysis is unavailable. Background features are labelled, not presented as breaking news.
  简报首先回答“这周发生了什么”；长篇背景不冒充周内新事件。
- **Importance and quality are assessed separately.** The baseline score allocates 60 points to news importance and 40 to article quality. Interest preferences guide selection among comparable candidates. Scores are editorial judgements, not objective truth.
  基础评分分为新闻重要性 60 分与文章质量 40 分；兴趣偏好用于同档候选的取舍，分数不是客观真理。
- **Breadth without filler.** Priority runs from world affairs to economy, society, culture and technology. All five fields are considered; gaps in suitable source material should be acknowledged rather than filled with weak stories.
  国际、经济、社会、文化、科技依次侧重；兼顾覆盖，但不以低质量内容补位。
- **Separate facts, claims and interpretation.** Preserve attribution, dates and uncertainty. Group coverage of the same event without erasing disagreement.
  区分事实、当事方主张与编辑分析，保留归因、日期、不确定性及跨刊分歧。
- **Bilingual guides, not full translations.** Summaries, background, argument outlines, evidence assessments and topic tags are provided in both languages. English is written naturally, with factual consistency between languages.
  摘要、背景、论点、证据分析与标签提供原创双语导读，不提供整篇翻译；两种语言须保持事实一致。

Source material varies by edition and includes publications such as *The Economist*, *The Guardian*, *Financial Times*, *The Wall Street Journal*, *The New York Times*, *Bloomberg Businessweek*, *The Atlantic* and *The New Yorker*. Longer-period publications may be used across several weeks. Inclusion does not imply affiliation or endorsement.

各期来源随所提供资料而变化；月刊等长周期内容可跨周选用。本站与所涉刊物无隶属关系，收录不代表其认可本站。

This is a curated selection from the available sources, not a complete account of world news. AI-assisted summaries can contain errors; consult the cited reporting, particularly before consequential decisions. Automated tests check structure and rendering, not the truth of every claim.

本站筛选的是现有来源中值得阅读的内容，而非全部世界新闻。AI 辅助摘要仍可能出错；重要判断请结合所引原文。自动化测试验证结构与渲染，不能替代事实核验。

## Sources, images and rights · 来源、图片与版权

- The site publishes original summaries and guides, not full magazine or newspaper articles. Source PDFs, extracted full text and OCR intermediates stay outside this repository and must not be committed.
- Third-party photographs retain their individual credits, source links and licence or reuse terms. News images should match the event; unrelated archival images are not decorative substitutes. Photo captions and credits are in English.
- Rights in quoted material, publication names and third-party images remain with their respective owners. Public access to this repository does not grant a blanket reuse licence. No project-wide software licence has been selected yet.

本站不转载原刊全文；原始 PDF、抽取全文及 OCR 中间文件不进入公开仓库。第三方图片逐项保留署名、来源及许可信息，新闻图片须与事件对应，图片注释仅用英语。第三方内容权利归原权利人所有；仓库公开不等于全部内容可自由再利用。目前尚未为项目代码选择统一开源许可证。

## Development · 本地开发

Built with React, TypeScript, vinext/Vite and CSS. A static export is deployed through Cloudflare Pages.

Requires **Node.js ≥ 22.13.0**. npm scripts use POSIX-style environment-variable syntax; on Windows, use WSL or adapt that syntax.

```bash
npm install
npm run dev
```

Build the deployable static site:

```bash
npm run build:pages
```

The output is `dist/client/`, including standalone analysis pages for direct links and refreshes. The existing GitHub-to-Cloudflare Pages integration publishes from `main` using this command and output directory.

静态产物位于 `dist/client/`，包含可直接访问、刷新的独立分析页。现有 GitHub / Cloudflare Pages 集成从 `main` 分支构建发布。

Run the build and automated checks:

```bash
npm test
```

### Repository map · 目录说明

```text
app/                 Homepage, standalone analysis routes and styles
data/                Editions, types, source/image records and editorial policies
public/              Public assets, including credited editorial images
scripts/             Static Pages export
tests/               Content, provenance, rendering and route checks
```

For a new edition, add structured content under `data/` and register it in `data/editions.ts`, newest first. Preserve historical editions and stable IDs, verify bilingual fields and source locations, then run the checks before publishing. Uploading PDFs alone does not automatically generate or fact-check an edition.

新增一期时，在 `data/` 保存结构化内容，并在 `data/editions.ts` 中按新到旧注册。保留历史期与稳定 ID，核查双语字段和来源位置，测试通过后发布。仅上传 PDF 不会自动生成或完成事实核验。

## Corrections · 纠错

Found an error or a broken source link? [Open an issue](https://github.com/selicinnamon/weekly-news/issues) with the edition date, story title, disputed passage and a supporting source where possible. Please do not upload copyrighted source PDFs.

如发现错误或失效链接，欢迎通过 Issue 提供期数、文章标题、相关表述及可核查来源；请勿上传受版权保护的原刊 PDF。
