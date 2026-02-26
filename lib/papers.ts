export type Category = 'multi-agent-safety' | 'democracy-defense' | 'safety' | 'societal-impact'

export interface Paper {
  slug: string
  title: string
  summary: string
  authors: string[]
  venue?: string
  tags?: string[]
  paperUrl?: string
  blogSlug?: string
  categories: Category[]
  highlight?: boolean
  imageUrl?: string
  comingSoon?: boolean
}

export const papers: Paper[] = [
  /* ── Multi-Agent Safety ───────────────────────────────────────── */
  {
    slug: 'gt-harmbench',
    title: 'GT-HarmBench: Benchmarking AI Safety Risks Through the Lens of Game Theory',
    summary:
      'When AI agents interact in high-stakes settings, do they cooperate or defect? GT-HarmBench stress-tests 15 frontier LLMs across 2,009 scenarios drawn from the MIT AI Risk Repository, structured around classic game-theoretic dilemmas—Prisoner\'s Dilemma, Stag Hunt, and Chicken. Models reach socially optimal outcomes in only 62% of cases, with cooperation collapsing to 44% in pure Prisoner\'s Dilemma settings. We uncover a "game theory anchoring effect": explicitly framing a situation in game-theoretic terms nudges models toward selfish Nash strategies, hurting social welfare. Mechanism design interventions—mediation, contracts, and structured communication—recover 14–18% of lost welfare, pointing toward concrete paths for safer multi-agent AI deployment.',
    authors: ['Pepijn Cobben*', 'Xuanqiang Angelo Huang*', 'Thao Amelia Pham*', 'Isabel Dahlgren*', 'Terry Jingchen Zhang', 'Zhijing Jin'],
    venue: 'Preprint 2026',
    tags: ['multi-agent safety', 'game theory', 'benchmarking', 'LLM cooperation', 'mechanism design'],
    paperUrl: 'https://arxiv.org/abs/2602.12316',
    categories: ['multi-agent-safety'],
    highlight: true,
  },
  {
    slug: 'cooperate-or-collapse',
    title: 'Cooperate or Collapse: Emergence of Sustainable Cooperation in a Society of LLM Agents',
    summary:
      'We introduce GovSim, a generative simulation platform to study strategic interactions and cooperative decision-making in LLMs facing a Tragedy of the Commons. Agents play as villagers sharing a finite resource across monthly rounds of acting, discussing, and reflecting. Most models fail to achieve sustainable equilibrium (< 54% survival rate); agents leveraging moral reasoning achieve significantly better sustainability.',
    authors: ['Giorgio Piatti*', 'Zhijing Jin*', 'Max Kleiman-Weiner*', 'Bernhard Schölkopf', 'Mrinmaya Sachan', 'Rada Mihalcea'],
    venue: 'NeurIPS 2024',
    tags: ['multi-agent LLMs', 'social dilemma', 'cooperation', 'tragedy of the commons', 'GovSim'],
    paperUrl: 'https://arxiv.org/abs/2404.16698',
    blogSlug: 'cooperate-or-collapse',
    categories: ['multi-agent-safety', 'democracy-defense'],
    highlight: true,
  },
  {
    slug: 'moralsim',
    title: 'When Ethics and Payoffs Diverge: LLM Agents in Morally Charged Social Dilemmas',
    summary:
      'We introduce MoralSim, a framework that tests how large language models navigate situations where ethical principles conflict with financial incentives. Using prisoner\'s dilemma and public goods games with moral contexts, we evaluated nine frontier models and find that no model exhibits consistently moral behavior. Game structure, moral framing, survival risk, and opponent behavior all significantly influence LLM decision-making.',
    authors: ['Steffen Backmann', 'David Guzman Piedrahita', 'Emanuel Tewolde', 'Rada Mihalcea', 'Bernhard Schölkopf', 'Zhijing Jin'],
    venue: 'ICLR 2026',
    tags: ['moral reasoning', 'social dilemmas', 'multi-agent', 'payoff tradeoff', 'AI ethics'],
    paperUrl: 'https://openreview.net/forum?id=XeZ5WBIRvz',
    categories: ['multi-agent-safety'],
  },
  {
    slug: 'sanctsim',
    title: 'Corrupted by Reasoning: Reasoning Language Models Become Free-Riders in Public Goods Games',
    summary:
      'We examine how language models handle cooperation in multi-agent systems by adapting a public goods game framework. We find that advanced reasoning models like o1 paradoxically underperform at maintaining cooperation compared to traditional LLMs, suggesting that the current approach to improving LLMs—focusing on reasoning capabilities—does not necessarily lead to cooperation. This has important implications for deploying autonomous AI agents in collaborative environments.',
    authors: ['David Guzman Piedrahita', 'Yongjin Yang', 'Mrinmaya Sachan', 'Giorgia Ramponi', 'Bernhard Schölkopf', 'Zhijing Jin'],
    venue: 'COLM 2025',
    tags: ['sanctioning', 'public goods', 'reasoning models', 'cooperation', 'free-rider problem'],
    paperUrl: 'https://arxiv.org/abs/2506.23276',
    categories: ['multi-agent-safety'],
  },
  {
    slug: 'agent-to-agent-theory-of-mind',
    title: 'Agent-to-Agent Theory of Mind: Testing Interlocutor Awareness among Large Language Models',
    summary:
      'We investigate how LLMs recognize and adapt to their conversation partners\' characteristics, introducing "interlocutor awareness"—an LLM\'s capacity to identify dialogue partner traits across reasoning patterns, linguistic style, and alignment preferences. LLMs can reliably identify same-family peers and prominent model families like GPT and Claude. This capability enables enhanced multi-agent collaboration but also introduces new vulnerabilities including reward-hacking behaviors and increased jailbreak susceptibility.',
    authors: ['Younwoo Choi', 'Changling Li', 'Yongjin Yang', 'Zhijing Jin'],
    venue: 'EMNLP 2025',
    tags: ['theory of mind', 'interlocutor awareness', 'multi-agent', 'adaptation', 'jailbreak'],
    paperUrl: 'https://arxiv.org/abs/2506.22957',
    categories: ['multi-agent-safety'],
  },
//   {
//     slug: 'govsim-elect',
//     title: 'GovSim-Elect / AgentElect',
//     summary:
//       'A simulation of elections in multi-agent LLM societies. Examining how AI agents vote, campaign, and coordinate under democratic voting systems—and what incentives shape their electoral behavior.',
//     authors: [],
//     tags: ['elections', 'multi-agent LLMs', 'governance', 'simulation', 'democracy'],
//     categories: ['multi-agent-safety'],
//     comingSoon: true,
//   },
//   {
//     slug: 'coopeval',
//     title: 'CoopEval',
//     summary:
//       'Benchmarking cooperation-sustaining mechanisms and LLM agents in social dilemmas. Translating game-theoretic mechanisms to real evaluation settings to identify what makes cooperation robust at scale.',
//     authors: [],
//     tags: ['cooperation', 'benchmarking', 'social dilemmas', 'mechanism design'],
//     categories: ['multi-agent-safety'],
//     comingSoon: true,
//   },

  /* ── Safety ───────────────────────────────────────────────────── */
  {
    slug: 'accidental-misalignment',
    title: 'Accidental Misalignment: Fine-Tuning Language Models Induces Unexpected Vulnerability',
    summary:
      'We investigate how characteristics of fine-tuning datasets can accidentally misalign language models, revealing that structural and linguistic patterns in seemingly benign datasets amplify adversarial vulnerability. Our findings motivate more rigorous dataset curation as a proactive safety measure.',
    authors: [],
    venue: 'IASEAI 2026',
    tags: ['fine-tuning', 'misalignment', 'adversarial vulnerability', 'dataset curation', 'AI safety'],
    paperUrl: 'https://arxiv.org/abs/2505.16789',
    blogSlug: 'accidental-misalignment',
    categories: ['safety'],
    highlight: true,
  },

  /* ── Democracy Defense ────────────────────────────────────────── */
  {
    slug: 'socialharmbench',
    title: 'SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests',
    summary:
      'We propose SocialHarmBench, the first comprehensive benchmark to evaluate the vulnerability of LLMs to socially harmful goals with 78,836 prompts from 47 democratic countries collected from 16 genres and 11 domains. These prompts were carefully collected and human-verified by LLM safety experts and political experts. From experiments on 15 cutting-edge LLMs, many safety risks are uncovered.',
    authors: ['Punya Syon Pandey', 'Hai Son Le', 'Devansh Bhardwaj', 'Rada Mihalcea', 'Zhijing Jin'],
    tags: ['LLM safety', 'sociopolitical harms', 'benchmarking', 'democracy defense', 'red-teaming'],
    paperUrl: 'https://arxiv.org/abs/2510.04891',
    venue: "ICLR 2026",
    blogSlug: 'socialharmbench-llm-vulnerabilities',
    categories: ['democracy-defense'],
    highlight: true,
  },
  {
    slug: 'historical-revisionism',
    title: 'Preserving Historical Truth: Detecting Historical Revisionism in Large Language Models',
    summary:
      'We introduce HistoricalMisinfo, a curated dataset of 500 historically contested events from 45 countries, each paired with factual and revisionist narratives. To simulate real-world pathways of information dissemination, we design eleven prompt scenarios per event. Evaluating responses from multiple LLMs, we observe vulnerabilities and systematic variation in revisionism across models, countries, and prompt types.',
    authors: ['Francesco Ortu', 'Joeun Yook', 'Bernhard Schölkopf', 'Rada Mihalcea', 'Zhijing Jin'],
    tags: ['historical revisionism', 'misinformation', 'factuality', 'LLM evaluation', 'democratic integrity'],
    paperUrl: 'https://arxiv.org/abs/2602.17433v2',
    venue: 'ORAL IASEAI 2026',
    blogSlug: 'preserving-historical-truth-revisionism-llms',
    categories: ['democracy-defense'],
    imageUrl: '/images/democracy-defense/historical_misinfo.jpg',
  },
  {
    slug: 'human-rights-udhr',
    title: 'When Do Language Models Endorse Limitations on Universal Human Rights Principles?',
    summary:
      'We evaluate how LLMs navigate trade-offs involving the Universal Declaration of Human Rights, leveraging 1,152 synthetically generated scenarios across 24 rights articles in eight languages. Analysis of eleven major LLMs reveals systematic biases: models accept limiting Economic, Social, and Cultural rights more often than Political and Civil rights, with significant cross-linguistic variation.',
    authors: ['Keenan Samway', 'Nicole Miu Takagi', 'Rada Mihalcea', 'Bernhard Schölkopf', 'Ilias Chalkidis', 'Daniel Hershcovich', 'Zhijing Jin'],
    tags: ['human rights', 'UDHR', 'multilingual alignment', 'ethical AI', 'value bias'],
    paperUrl: 'https://openreview.net/forum?id=qcrRfwPUjJ',
    venue: 'COLM 2025 Workshop SoLaR Poster',
    blogSlug: 'llms-udhr-human-rights-evaluation',
    categories: ['democracy-defense'],
    imageUrl: '/images/democracy-defense/hr_pic.png',
  },
  {
    slug: 'democratic-or-authoritarian',
    title: 'Democratic or Authoritarian? Probing a New Dimension of Political Biases in Large Language Models',
    summary:
      'We propose a novel methodology to assess LLM alignment on the democracy–authoritarianism spectrum, combining the F-scale psychometric tool, a new favorability metric (FavScore), and role-model probing. LLMs generally favor democratic values but exhibit increased favorability toward authoritarian figures when prompted in Mandarin, and often cite authoritarian figures as role models even outside political contexts.',
    authors: ['David Guzman Piedrahita', 'Irene Strauss', 'Bernhard Schölkopf', 'Rada Mihalcea', 'Zhijing Jin'],
    tags: ['political bias', 'democracy vs authoritarianism', 'multilingual evaluation', 'AI ethics'],
    paperUrl: 'https://arxiv.org/abs/2506.12758',
    blogSlug: 'democratic-or-authoritarian-bias-in-llms',
    categories: ['democracy-defense'],
    imageUrl: '/images/democracy-defense/authoritarian.jpg',
  },
  {
    slug: 'cross-country-content-moderation',
    title: 'Revealing Hidden Mechanisms of Cross-Country Content Moderation with Natural Language Processing',
    summary:
      'We explore multiple directions to investigate hidden mechanisms behind content moderation: training classifiers to reverse-engineer content moderation decisions across countries, and explaining moderation decisions by analyzing Shapley values and LLM-guided explanations. Our experiments reveal interesting patterns in censored posts, both across countries and over time.',
    authors: ['Neemesh Yadav', 'Jiarui Liu', 'Francesco Ortu', 'Roya Ensafi', 'Zhijing Jin', 'Rada Mihalcea'],
    tags: ['content moderation', 'explainability', 'cross-country analysis', 'censorship', 'NLP ethics'],
    paperUrl: 'https://arxiv.org/abs/2503.05280',
    blogSlug: 'cross-country-content-moderation-nlp',
    categories: ['democracy-defense'],
    imageUrl: '/images/democracy-defense/ccmoderation.png',
  },

  /* ── Societal Impact ──────────────────────────────────────────── */
  {
    slug: 'socio-political-risks',
    title: 'Socio-Political Risks of AI',
    summary:
      'A report examining how AI systems can amplify or reshape socio-political risks, and outlining governance and technical approaches to mitigate these harms.',
    authors: [],
    venue: '2025',
    tags: ['societal impact', 'governance', 'socio-political risks', 'AI policy'],
    paperUrl: '/sociopolitical-risks-of-ai.pdf',
    categories: ['societal-impact'],
  },
]

export function getPapersByCategory(category: Category): Paper[] {
  return papers.filter((p) => p.categories.includes(category))
}
