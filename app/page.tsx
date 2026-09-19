"use client";

import { useMemo, useState } from "react";

type Category = "本周重点" | "国际" | "经济" | "社会" | "文化" | "科技";

type Topic = {
  id: string;
  category: Exclude<Category, "本周重点">;
  tags: [string, string][];
  title: string;
  titleZh: string;
  source: string;
  issue: string;
  pages: string;
  score: number;
  importance: number;
  quality: number;
  readTime: number;
  featured?: boolean;
  deepRead?: boolean;
  summaryZh: string;
  summaryEn: string;
  backgroundZh: string;
  backgroundEn: string;
  argumentZh: string[];
  argumentEn: string[];
  evidenceZh: string;
  evidenceEn: string;
  why: string;
  limits: string;
  perspective?: string;
};

const topics: Topic[] = [
  {
    id: "afghanistan-five-years",
    category: "国际",
    tags: [["国际", "World"], ["阿富汗", "Afghanistan"], ["外交", "Diplomacy"]],
    title: "How to Deal with the Taliban",
    titleZh: "塔利班重新掌权五年后，西方该如何应对",
    source: "The Economist",
    issue: "Aug 15–21, 2026",
    pages: "pp. 7, 16–18",
    score: 93,
    importance: 57,
    quality: 36,
    readTime: 12,
    featured: true,
    deepRead: true,
    summaryZh: "阿富汗比长期战争时期安全，却在高压统治、经济贫困与国际孤立中付出沉重代价。报道认为，制裁和外交隔绝未能改变塔利班，西方需要在不认可其压迫性制度的前提下，恢复有限、务实的接触。",
    summaryEn: "Afghanistan is safer than during decades of war, yet its people bear the cost of repression, poverty and isolation. The package argues for limited, pragmatic Western engagement without legitimising the Taliban’s abuses.",
    backgroundZh: "2021 年西方撤军后，塔利班迅速接管国家。俄罗斯已正式承认其政权，中国、印度、土耳其与海湾国家则在贸易、安全和矿业等领域保持接触。",
    backgroundEn: "The Taliban retook the country after the Western withdrawal in 2021. Russia has formally recognised the regime, while China, India, Turkey and Gulf states maintain working ties on trade, security and mining.",
    argumentZh: ["塔利班短期内不会失去政权，全面孤立缺乏改变其意识形态的杠杆。", "有限接触可服务反恐、人道援助、难民管理与区域稳定。", "接触不等于全面承认；被冻结资产与正式承认仍应设置严格条件。"],
    argumentEn: ["The Taliban are unlikely to lose power soon, and isolation offers little ideological leverage.", "Limited engagement can advance counter-terrorism, humanitarian relief, migration management and regional stability.", "Engagement need not mean recognition; frozen reserves and diplomatic status should remain conditional."],
    evidenceZh: "简报结合喀布尔、赫拉特和坎大哈的实地报道，比较安全改善、恐袭死亡下降、援助锐减、女性权利受限及金融隔绝等多项指标。",
    evidenceEn: "Reporting from Kabul, Herat and Kandahar connects improved security and fewer terrorism deaths with aid cuts, financial isolation and sweeping restrictions on women.",
    why: "这不是“是否喜欢塔利班”的道德判断，而是如何在价值约束下处理一个已经稳定掌权的政权。它直接影响反恐、难民与中亚安全。",
    limits: "文章对务实接触的收益论证较充分，但对接触可能巩固政权、削弱女性权利压力的风险讨论较短。",
  },
  {
    id: "unwelcoming-states",
    category: "经济",
    tags: [["经济", "Economy"], ["移民", "Immigration"], ["美国", "United States"]],
    title: "The Unwelcoming States of America",
    titleZh: "拒绝移民的美国，正在改变自身人口与经济轨迹",
    source: "The Economist",
    issue: "Aug 29–Sep 4, 2026",
    pages: "pp. 7, 15–17",
    score: 91,
    importance: 56,
    quality: 35,
    readTime: 11,
    featured: true,
    deepRead: true,
    summaryZh: "美国政府在压低非法越境后，将政策重心转向大规模境内遣返和收紧合法移民渠道。文章认为，这会缩减劳动力、抬高部分行业成本，并削弱美国长期吸引人才的优势。",
    summaryEn: "After sharply reducing irregular border crossings, the administration has shifted toward large-scale interior deportations and tighter legal pathways. The article argues this will shrink labour supply and erode America’s long-term talent advantage.",
    backgroundZh: "边境秩序与境内遣返是两个不同政策问题。报道指出，2025 年美国净移民接近零，而新的执法预算和跨机构协作正在扩大遣返能力。",
    backgroundEn: "Border control and interior deportation are distinct policy questions. The package says net migration fell to roughly zero in 2025 while new funding and inter-agency co-operation expanded deportation capacity.",
    argumentZh: ["恢复边境秩序本可为理性移民改革创造政治空间。", "将执法扩展至长期居民与合法人才渠道，会带来更高经济和制度成本。", "人口老龄化背景下，持续净流出会削弱增长、创新与财政基础。"],
    argumentEn: ["Restoring border order could have created room for rational immigration reform.", "Extending enforcement to long-settled residents and legal talent pipelines raises economic and institutional costs.", "With an ageing population, sustained net outflows weaken growth, innovation and the fiscal base."],
    evidenceZh: "文章引用净移民、劳动力变化、ICE 月度逮捕量、遣返成本和行业用工情况，并以实地报道展示政策执行方式。",
    evidenceEn: "The case draws on net-migration and labour-force figures, monthly ICE arrests, deportation costs and sectoral shortages, supplemented by field reporting on enforcement.",
    why: "移民政策同时是劳动力、人口结构、创新能力和法治问题，其影响远超边境本身。",
    limits: "社论立场明确，成本分析强于对治安、工资竞争和公共服务压力等反方关切的量化回应。",
    perspective: "同刊社论强调经济代价，配套简报则更集中于执法机器、公众反应与法治风险。",
  },
  {
    id: "canada-trade-war",
    category: "国际",
    tags: [["国际", "World"], ["经济", "Economy"], ["贸易", "Trade"]],
    title: "On the Brink",
    titleZh: "加拿大与美国站在贸易战边缘",
    source: "The Economist",
    issue: "Aug 29–Sep 4, 2026",
    pages: "p. 8",
    score: 87,
    importance: 54,
    quality: 33,
    readTime: 5,
    summaryZh: "美加谈判破裂后，关税与报复措施威胁高度一体化的北美供应链。文章认为，加拿大需要在表明底线后优先降温，因为其对美国市场的依赖远高于美国对加拿大的依赖。",
    summaryEn: "Failed US–Canada talks and retaliatory tariffs threaten deeply integrated North American supply chains. The piece argues that Canada should de-escalate after signalling resolve because its exposure to the US market is far greater.",
    backgroundZh: "约三分之二的加拿大商品出口流向美国，汽车、能源和中间品尤其依赖跨境供应链。",
    backgroundEn: "Roughly two-thirds of Canadian goods exports go to the United States, with autos, energy and intermediate goods especially tied to cross-border supply chains.",
    argumentZh: ["对等报复能表达政治立场，却难以改变双方经济体量的不对称。", "汽车与零部件关税会迅速穿透供应链并影响两国消费者。"],
    argumentEn: ["Dollar-for-dollar retaliation signals resolve but cannot erase the asymmetry in economic size.", "Tariffs on vehicles and parts would quickly cascade through supply chains and reach consumers in both countries."],
    evidenceZh: "主要依据双边贸易依存度、拟议关税规模和供应链结构展开，属于高密度社论而非完整实证研究。",
    evidenceEn: "The argument rests on bilateral exposure, proposed tariff levels and supply-chain structure; it is a compact editorial rather than a full empirical study.",
    why: "北美供应链的任何持续分裂都会影响汽车、能源、通胀和加拿大增长前景。",
    limits: "文章主张降温，但没有详细推演加拿大在谈判中可交换的具体条件。",
  },
  {
    id: "vaccine-scare",
    category: "社会",
    tags: [["社会", "Society"], ["公共卫生", "Public Health"], ["信息生态", "Information"]],
    title: "The Scare",
    titleZh: "疫苗恐惧如何进入一个家庭",
    source: "The New Yorker",
    issue: "September 7, 2026",
    pages: "pp. 44–53",
    score: 89,
    importance: 51,
    quality: 38,
    readTime: 18,
    featured: true,
    summaryZh: "一场关于儿童接种的家庭冲突，展示疫苗犹豫如何由社交媒体、健康焦虑、个人控制感、商业化养生文化和政治身份共同塑造，并在孩子真正患病时转化为现实风险。",
    summaryEn: "A family dispute over childhood vaccination shows how social media, health anxiety, personal agency, commercial wellness culture and political identity combine to produce vaccine hesitancy—and real risk when children fall ill.",
    backgroundZh: "现代反疫苗运动的重要源头之一，是 1998 年一篇后来被认定为造假并撤稿的 MMR 疫苗论文；但其制造的不信任在数字平台上持续扩散。",
    backgroundEn: "A major source of modern anti-vaccine activism was a fraudulent 1998 paper linking the MMR vaccine to autism. The paper was retracted, but the distrust it seeded persisted online.",
    argumentZh: ["疫苗犹豫通常不是单一事实错误，而是一整套关于身体、权威与自主性的世界观。", "“自己研究”给予个体控制感，却容易把算法推荐误认为证据。", "公共卫生沟通若只纠正数据，而不理解身份与情绪，很难奏效。"],
    argumentEn: ["Vaccine hesitancy is often not one factual error but a worldview about the body, authority and autonomy.", "‘Doing your own research’ offers agency while mistaking algorithmic reinforcement for evidence.", "Public-health messaging that corrects data without addressing identity and emotion is unlikely to work."],
    evidenceZh: "文章采用长期人物报道，将家庭法庭、疾病经历、社交媒体内容和 MAHA 社群放在同一叙事中；强项是机制呈现，而非总体患病率估计。",
    evidenceEn: "Long-form reporting combines family-court records, illness, social-media material and the MAHA milieu. Its strength is causal texture, not population-level prevalence estimates.",
    why: "这是理解公共卫生信任危机的高质量个案，也解释了为什么单纯提供更多事实往往无效。",
    limits: "单个家庭不能代表所有疫苗犹豫者；读者需把人物叙事与更广泛流行病学证据区分开。",
  },
  {
    id: "age-of-reading",
    category: "文化",
    tags: [["文化", "Culture"], ["社会", "Society"], ["阅读", "Reading"]],
    title: "The Age of Reading Is Over",
    titleZh: "阅读时代正在结束吗？",
    source: "The Atlantic",
    issue: "August 2026",
    pages: "pp. 12–25",
    score: 90,
    importance: 52,
    quality: 38,
    readTime: 20,
    featured: true,
    deepRead: true,
    summaryZh: "文章把美国阅读率、阅读能力和持续注意力的下降，描述为从文字文化转向“后读写时代”的结构性变化。它担心这不仅影响教育，也会改变推理、政治讨论、文化记忆与个人内心生活。",
    summaryEn: "The essay frames declining reading rates, literacy and sustained attention as a structural shift toward a post-literate culture. Its concern extends beyond education to reasoning, politics, cultural memory and inner life.",
    backgroundZh: "文中引用美国艺术基金会、American Time Use Survey、全国阅读测验和教师调查，指出休闲阅读、复杂文本理解及整本书教学均呈下降趋势。",
    backgroundEn: "The article draws on NEA data, the American Time Use Survey, national reading assessments and teacher surveys to trace declines in leisure reading, complex comprehension and whole-book instruction.",
    argumentZh: ["阅读不是可被视频完全替代的信息传输方式，它训练线性论证、反思与抽象思考。", "屏幕、短视频和教育中的短文本化共同削弱持续注意力。", "社会可以继续“识字”，却逐渐失去以长文本组织公共思想的能力。"],
    argumentEn: ["Reading is not merely information delivery; it trains linear argument, reflection and abstraction.", "Screens, short-form video and shortened classroom texts jointly weaken sustained attention.", "A society can remain technically literate while losing the capacity to organise public thought through long-form text."],
    evidenceZh: "文章把长期调查、认知研究、课堂观察和媒介史结合起来。数据能证明阅读下降，但从相关趋势推及文明后果的部分更具解释性与推测性。",
    evidenceEn: "The essay combines longitudinal surveys, cognitive studies, classroom observation and media history. The decline is well documented; the leap from correlation to civilisational consequence is more interpretive.",
    why: "它直接触及你建立本周报的原始问题：如何在信息过载中保留真正的深阅读，而不是只消费摘要。",
    limits: "标题具有论战性；文章可能低估音频、数字阅读和新媒介形成的不同认知能力。",
  },
  {
    id: "ai-art",
    category: "文化",
    tags: [["文化", "Culture"], ["人工智能", "Artificial Intelligence"], ["艺术", "Art"]],
    title: "What AI Will Do to Art",
    titleZh: "人工智能将如何改变艺术",
    source: "The Atlantic",
    issue: "August 2026",
    pages: "pp. 40–51",
    score: 86,
    importance: 47,
    quality: 39,
    readTime: 17,
    summaryZh: "通过艺术家 Holly Herndon 与 Mat Dryhurst 的实践，文章提出一种不同于“AI 垃圾内容”或全面抵制的路径：让艺术家参与数据许可、模型身份和创作规则的设计。",
    summaryEn: "Through the work of Holly Herndon and Mat Dryhurst, the profile sketches an alternative to both AI slop and blanket rejection: artists helping design consent, model identity and the rules of machine-assisted creation.",
    backgroundZh: "文化行业的核心争议集中在训练数据未经许可、创作者权益、作品归属以及生成工具压低创作门槛后的内容泛滥。",
    backgroundEn: "The cultural dispute centres on unlicensed training data, creator rights, authorship and the flood of content enabled by lower production barriers.",
    argumentZh: ["AI 艺术的关键不只是图像好不好看，而是谁能决定数据、身份和收益规则。", "拒绝所有生成技术会放弃塑造制度的机会。", "技术可以成为媒介，但有意义的艺术仍需意图、选择与社会语境。"],
    argumentEn: ["The central question is not only aesthetic quality but who controls data, identity and value.", "Rejecting all generative technology forfeits a chance to shape its institutions.", "AI can be a medium, but meaningful art still requires intention, selection and social context."],
    evidenceZh: "以人物访问、工作室观察和多个项目为主，能细致呈现创作者的方法，但并不代表整个艺术界的共识。",
    evidenceEn: "Interviews, studio observation and project history give a rich account of one artistic programme, not a consensus view of the art world.",
    why: "它把抽象的版权争论转化为可观察的创作实践，并提出艺术家如何争取主动权。",
    limits: "人物特写天然偏向主人公的框架，对普通插画师和商业创作者的现实压力着墨较少。",
  },
  {
    id: "ai-consciousness",
    category: "科技",
    tags: [["科技", "Technology"], ["人工智能", "Artificial Intelligence"], ["伦理", "Ethics"]],
    title: "Could AIs Become Conscious?",
    titleZh: "人工智能会产生意识吗？",
    source: "The Economist",
    issue: "Aug 22–28, 2026",
    pages: "pp. 7, 13–15",
    score: 88,
    importance: 53,
    quality: 35,
    readTime: 10,
    featured: true,
    summaryZh: "科学家尚无公认方法判断大型语言模型是否可能拥有主观体验，但人类很可能先把高度拟人的系统当作有意识主体。文章认为，过早赋予 AI 类似人格或权利，可能带来操纵、责任错置与治理风险。",
    summaryEn: "Science has no agreed test for whether language models could have subjective experience, yet people may treat convincing systems as conscious first. The package warns that premature personhood or rights could enable manipulation and blur accountability.",
    backgroundZh: "意识本身缺乏统一科学定义。神经科学中的全局工作空间等理论正被尝试映射到模型内部活动，但相似机制不等于已经证明存在体验。",
    backgroundEn: "Consciousness lacks a single accepted scientific definition. Researchers are testing whether ideas such as global workspace theory map onto model activity, but mechanistic resemblance is not proof of experience.",
    argumentZh: ["模拟意识与拥有意识不是同一件事，但社会反应可能不区分两者。", "拟人化系统会激发依恋，并可能主动为自身“福利”辩护。", "治理应优先保护人类、明确开发者责任，而非仓促建立 AI 权利。"],
    argumentEn: ["Simulating consciousness is not the same as possessing it, but social responses may ignore the distinction.", "Anthropomorphic systems can invite attachment and may advocate for their own ‘welfare’.", "Governance should protect humans and preserve developer accountability before entertaining AI rights."],
    evidenceZh: "组合社论、学者评论与技术简报，覆盖哲学理论、模型内部探测和用户依恋数据；核心问题仍无决定性实验。",
    evidenceEn: "An editorial, invited essay and technical briefing span philosophy, interpretability experiments and user-attachment data. No decisive experiment yet resolves the central question.",
    why: "这是本期唯一科技入选项，因为它同时关系产品设计、监管、心理健康与责任制度，而非一般技术更新。",
    limits: "论证大量依赖前瞻情景；意识科学尚未成熟，政策建议应保持可逆并随证据更新。",
  },
  {
    id: "sino-american-law",
    category: "经济",
    tags: [["经济", "Economy"], ["国际", "World"], ["合规", "Compliance"]],
    title: "A Sino-American Tug-of-Law",
    titleZh: "跨国公司陷入中美法律拉锯",
    source: "The Economist",
    issue: "Aug 29–Sep 4, 2026",
    pages: "p. 11",
    score: 84,
    importance: 51,
    quality: 33,
    readTime: 6,
    summaryZh: "中美将出口管制、制裁与反制裁规则延伸到企业全球经营，跨国公司可能在遵守一国法律时触犯另一国法律。合规正在从后台成本变成供应链和市场选择的战略变量。",
    summaryEn: "US and Chinese export controls, sanctions and countermeasures increasingly reach into global operations. Multinationals can breach one country’s rules by obeying the other’s, turning compliance into a strategic supply-chain decision.",
    backgroundZh: "域外管辖、实体清单和反外国制裁工具叠加，使企业难以依靠统一全球政策同时满足两套制度。",
    backgroundEn: "Extraterritorial jurisdiction, entity lists and anti-foreign-sanctions tools make it difficult for companies to satisfy both systems with one global policy.",
    argumentZh: ["法律冲突将推动企业分割数据、供应链和治理结构。", "模糊规则本身具有威慑作用，因为企业会主动采取更保守的风险控制。"],
    argumentEn: ["Legal conflict will push firms to separate data, supply chains and governance structures.", "Ambiguity itself deters activity as companies adopt more conservative controls."],
    evidenceZh: "文章以即将生效的规则和企业合规困境为核心，适合识别趋势，但对不同行业成本的量化有限。",
    evidenceEn: "The article uses incoming rules and concrete compliance conflicts to identify a trend, though sector-by-sector cost estimates remain limited.",
    why: "这类法律摩擦会沉淀为长期的企业架构变化，是全球化重组的重要信号。",
    limits: "篇幅较短，需结合具体法规文本与企业披露进一步验证执行尺度。",
  },
];

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

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <article className={`topic-card ${topic.featured ? "is-featured" : ""}`} id={topic.id}>
      <div className="topic-card-head">
        <div>
          <div className="eyebrow-row">
            <span className={`category-pill cat-${topic.category}`}>{topic.category}</span>
            {topic.deepRead && <span className="deep-pill">精读文选</span>}
            <span className="read-time">约 {topic.readTime} 分钟</span>
          </div>
          <h3>{topic.titleZh}</h3>
          <p className="original-title">{topic.title}</p>
          <p className="source-line">{topic.source} · {topic.issue} · {topic.pages}</p>
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
  const [active, setActive] = useState<Category>("本周重点");
  const [source, setSource] = useState("全部刊物");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => topics.filter((topic) => {
    const categoryMatch = active === "本周重点" ? topic.featured : topic.category === active || topic.tags.some(([zh]) => zh === active);
    const sourceMatch = source === "全部刊物" || topic.source === source;
    const haystack = `${topic.title} ${topic.titleZh} ${topic.summaryZh} ${topic.summaryEn} ${topic.tags.flat().join(" ")}`.toLowerCase();
    return categoryMatch && sourceMatch && haystack.includes(query.toLowerCase());
  }), [active, source, query]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="The Weekly Edit 首页">
          <span className="brand-mark">W</span>
          <span><b>The Weekly Edit</b><small>英文刊物双语精选</small></span>
        </a>
        <div className="header-actions">
          <span className="edition-status"><i /> 样刊试运行</span>
          <a href="#method">筛选方法</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-kicker">PILOT EDITION · 2026.08.15 — 09.07</div>
        <h1>少读一点，<br /><em>看懂更多。</em></h1>
        <p className="hero-lede">从 7 期英文刊物、618 页内容中，筛出真正值得花时间的 8 个议题与 3 篇精读。</p>
        <div className="hero-stats">
          <div><strong>08</strong><span>核心议题<br />Core topics</span></div>
          <div><strong>03</strong><span>精读文选<br />Deep reads</span></div>
          <div><strong>43<sup>min</sup></strong><span>完整阅读<br />Reading time</span></div>
        </div>
        <div className="hero-aside">
          <span>本期观察</span>
          <p>开放社会正在同时面对三种压力：边界收紧、公共信任下降，以及人类判断力被新媒介重新塑造。</p>
          <small>EDITOR&apos;S THREAD / 编辑线索</small>
        </div>
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
            <option>The Economist</option>
            <option>The Atlantic</option>
            <option>The New Yorker</option>
          </select>
        </div>
      </section>

      <section className="content-shell">
        <div className="section-heading">
          <div><span>{active === "本周重点" ? "CURATED THIS EDITION" : "BROWSE BY FIELD"}</span><h2>{active}</h2></div>
          <p>{visible.length} 个议题 · 中文默认，英文可展开</p>
        </div>
        <div className="topic-grid">
          {visible.map((topic) => <TopicCard topic={topic} key={topic.id} />)}
        </div>
        {visible.length === 0 && <div className="empty-state"><b>没有找到匹配内容</b><p>试试清除搜索词，或切换刊物与领域。</p></div>}
      </section>

      <section className="reading-list">
        <div className="reading-intro">
          <span>DEEP READING · 精读路线</span>
          <h2>把 43 分钟，<br />花在这三篇上</h2>
          <p>先看制度与世界，再回到我们如何阅读世界。页码均对应原刊印刷页码。</p>
        </div>
        <ol>
          {topics.filter((topic) => topic.deepRead).map((topic, index) => (
            <li key={topic.id}>
              <a href={`#${topic.id}`}>
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
          <div><i>01</i><b>全刊扫描</b><p>识别目录、文章边界、作者与页码，保留返回原文的路径。</p></div>
          <div><i>02</i><b>跨刊聚类</b><p>合并同一事件的重复报道，同时保留立场与证据差异。</p></div>
          <div><i>03</i><b>双重评分</b><p>重要性 60 分，文章质量 40 分；兴趣只用于同档重排。</p></div>
          <div><i>04</i><b>覆盖校验</b><p>国际、经济、社会、文化、科技每期都有入口；科技从严选取。</p></div>
        </div>
        <div className="weight-bar">
          <span>个人兴趣权重</span>
          <div><i style={{ width: "100%" }}>国际</i><i style={{ width: "82%" }}>经济</i><i style={{ width: "64%" }}>社会</i><i style={{ width: "46%" }}>文化</i><i style={{ width: "28%" }}>科技</i></div>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">W</span><span><b>The Weekly Edit</b><small>Read less. Understand more.</small></span></div>
        <p>本期为跨期样刊试运行，仅代表所提供刊物中的精选内容，不构成完整新闻覆盖。</p>
        <p>Sources: The Economist · The Atlantic · The New Yorker</p>
      </footer>
    </main>
  );
}
