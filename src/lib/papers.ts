export type Category = "multi-agent-safety" | "democracy-defense" | "safety";

export interface Paper {
  slug: string;
  title: string;
  summary: string;
  authors: string[];
  venue?: string;
  tags?: string[];
  paperUrl?: string;
  blogSlug?: string;
  categories: Category[];
  highlight?: boolean;
  comingSoon?: boolean;
}

export const papers: Paper[] = [
  /* ── Multi-Agent Safety ───────────────────────────────────────── */
  {
    slug: "when-agents-lie",
    title: "When Agents Lie: Premeditation, Persistence, and Exploitation in Repeated Games",
    summary:
      "When LLM agents announce their intentions before acting, do they honor them? A three-stage protocol separating private intent, public announcement, and final action lets us distinguish premeditated deception from a genuine change of mind. Across three frontier models, six games, and 10 rounds, deviations from an announcement were already present in the agent's private plan in over 90% of the highest-deception conditions. Yet the same model ranges from perfect honesty to near-total deviation depending on the game. Models also disagree on what an announcement means: some treat it as a binding commitment, others as cheap talk, producing payoff gaps that emerge in round 0 and persist across all 10 rounds. Systems that mix models from different providers cannot assume shared announcement semantics.",
    authors: ["Jerick Shi", "Terry Jingchen Zhang", "Bernhard Schölkopf", "Vincent Conitzer", "Zhijing Jin"],
    venue: "ICML 2026 NExT-Game Workshop (Best Paper)",
    tags: ["deception", "commitment", "repeated games", "multi-agent", "cross-model interaction"],
    paperUrl: "https://arxiv.org/abs/2607.05132",
    categories: ["multi-agent-safety"],
  },
  {
    slug: "cheap-talk-empty-promise",
    title: "Cheap Talk, Empty Promise: Frontier LLMs Easily Break Public Promises for Self-Interest",
    summary:
      "Do LLM agents keep the promises they make? Treating deception as a deviation from a publicly announced action, we evaluate nine frontier models across six canonical games and categorize each deviation by its impact. Agents break their stated promises in 56.6% of scenarios, and most models do so without ever acknowledging the deviation. Public announcements between agents cannot, therefore, be treated as commitments.",
    authors: ["Jerick Shi", "Terry Jingchen Zhang", "Zhijing Jin", "Vincent Conitzer"],
    venue: "ICLR 2026 AI for Mechanism Design Workshop",
    tags: ["deception", "commitment", "cheap talk", "multi-agent", "mechanism design"],
    paperUrl: "https://arxiv.org/abs/2604.04782",
    categories: ["multi-agent-safety"],
  },
  {
    slug: "open-source-game-theory",
    title: "Proving Your Way to Cooperation: Formalizing Proof-Based Open Source Game Theory in Lean",
    summary:
      "Open Source Game Theory studies strategic interaction between agents with full mutual transparency, a promising route to robust cooperation in multi-agent systems. Its proof-based branch, where agents condition on bounded proof search over each other's source code, is theoretically rich but had no mechanized framework. We give the first Lean 4 formalization: nine open-source programs with manually written, machine-checked proofs of the outcome theorems governing their pairwise play, plus an agentic pipeline that turns natural-language strategy descriptions into Lean-verified theorems and autonomously reproves 40 of the 45 outcomes. Enumerating the Nash equilibria of the induced Prisoner's Dilemma program meta-game reveals a broad spectrum of cooperative equilibria absent from the underlying game.",
    authors: ["Colomban Duclaux", "Riccardo Formenti", "Pepijn Cobben", "Bernhard Schölkopf", "Zhijing Jin"],
    venue: "ICML 2026 AI4Math Workshop",
    tags: ["open source game theory", "program equilibrium", "Lean 4", "formal verification", "LLM proof automation"],
    paperUrl: "https://openreview.net/forum?id=Wc5TAIUC8k",
    categories: ["multi-agent-safety"],
  },
  {
    slug: "gt-harmbench",
    title: "GT-HarmBench: Benchmarking AI Safety Risks Through the Lens of Game Theory",
    summary:
      "When AI agents interact in high-stakes settings, do they cooperate or defect? GT-HarmBench stress-tests 15 frontier LLMs across 2,009 scenarios drawn from the MIT AI Risk Repository, structured around classic game-theoretic dilemmas—Prisoner's Dilemma, Stag Hunt, and Chicken. Models reach socially optimal outcomes in only 62% of cases, with cooperation collapsing to 44% in pure Prisoner's Dilemma settings. We uncover a \"game theory anchoring effect\": explicitly framing a situation in game-theoretic terms nudges models toward selfish Nash strategies, hurting social welfare. Mechanism design interventions—mediation, contracts, and structured communication—recover 14–18% of lost welfare, pointing toward concrete paths for safer multi-agent AI deployment.",
    authors: ["Pepijn Cobben*", "Xuanqiang Angelo Huang*", "Thao Amelia Pham*", "Isabel Dahlgren*", "Terry Jingchen Zhang", "Zhijing Jin"],
    venue: "Preprint 2026",
    tags: ["multi-agent safety", "game theory", "benchmarking", "LLM cooperation", "mechanism design"],
    paperUrl: "https://arxiv.org/abs/2602.12316",
    categories: ["multi-agent-safety"],
    highlight: true,
  },
  {
    slug: "cooperate-or-collapse",
    title: "Cooperate or Collapse: Emergence of Sustainable Cooperation in a Society of LLM Agents",
    summary:
      "We introduce GovSim, a generative simulation platform to study strategic interactions and cooperative decision-making in LLMs facing a Tragedy of the Commons. Agents play as villagers sharing a finite resource across monthly rounds of acting, discussing, and reflecting. Most models fail to achieve sustainable equilibrium (< 54% survival rate); agents leveraging moral reasoning achieve significantly better sustainability.",
    authors: ["Giorgio Piatti*", "Zhijing Jin*", "Max Kleiman-Weiner*", "Bernhard Schölkopf", "Mrinmaya Sachan", "Rada Mihalcea"],
    venue: "NeurIPS 2024",
    tags: ["multi-agent LLMs", "social dilemma", "cooperation", "tragedy of the commons", "GovSim"],
    paperUrl: "https://arxiv.org/abs/2404.16698",
    blogSlug: "cooperate-or-collapse",
    categories: ["multi-agent-safety"],
    highlight: true,
  },
  {
    slug: "moralsim",
    title: "When Ethics and Payoffs Diverge: LLM Agents in Morally Charged Social Dilemmas",
    summary:
      "We introduce MoralSim, a framework that tests how large language models navigate situations where ethical principles conflict with financial incentives. Using prisoner's dilemma and public goods games with moral contexts, we evaluated nine frontier models and find that no model exhibits consistently moral behavior. Game structure, moral framing, survival risk, and opponent behavior all significantly influence LLM decision-making.",
    authors: ["Steffen Backmann", "David Guzman Piedrahita", "Emanuel Tewolde", "Rada Mihalcea", "Bernhard Schölkopf", "Zhijing Jin"],
    venue: "ICLR 2026",
    tags: ["moral reasoning", "social dilemmas", "multi-agent", "payoff tradeoff", "AI ethics"],
    paperUrl: "https://openreview.net/forum?id=XeZ5WBIRvz",
    categories: ["multi-agent-safety"],
  },
  {
    slug: "sanctsim",
    title: "Corrupted by Reasoning: Reasoning Language Models Become Free-Riders in Public Goods Games",
    summary:
      "We examine how language models handle cooperation in multi-agent systems by adapting a public goods game framework. We find that advanced reasoning models like o1 paradoxically underperform at maintaining cooperation compared to traditional LLMs, suggesting that the current approach to improving LLMs—focusing on reasoning capabilities—does not necessarily lead to cooperation. This has important implications for deploying autonomous AI agents in collaborative environments.",
    authors: ["David Guzman Piedrahita", "Yongjin Yang", "Mrinmaya Sachan", "Giorgia Ramponi", "Bernhard Schölkopf", "Zhijing Jin"],
    venue: "COLM 2025",
    tags: ["sanctioning", "public goods", "reasoning models", "cooperation", "free-rider problem"],
    paperUrl: "https://arxiv.org/abs/2506.23276",
    categories: ["multi-agent-safety"],
  },
  {
    slug: "agent-to-agent-theory-of-mind",
    title: "Agent-to-Agent Theory of Mind: Testing Interlocutor Awareness among Large Language Models",
    summary:
      "We investigate how LLMs recognize and adapt to their conversation partners' characteristics, introducing \"interlocutor awareness\"—an LLM's capacity to identify dialogue partner traits across reasoning patterns, linguistic style, and alignment preferences. LLMs can reliably identify same-family peers and prominent model families like GPT and Claude. This capability enables enhanced multi-agent collaboration but also introduces new vulnerabilities including reward-hacking behaviors and increased jailbreak susceptibility.",
    authors: ["Younwoo Choi", "Changling Li", "Yongjin Yang", "Zhijing Jin"],
    venue: "EMNLP 2025",
    tags: ["theory of mind", "interlocutor awareness", "multi-agent", "adaptation", "jailbreak"],
    paperUrl: "https://arxiv.org/abs/2506.22957",
    categories: ["multi-agent-safety"],
  },

  /* ── Safety ───────────────────────────────────────────────────── */
  {
    slug: "training-with-honeypots",
    title: "Training with Honeypots: Reshaping How LLMs Fail Under Adversarial Attacks",
    summary:
      "Automated red-teaming reports attack success rates, assuming that a judge flagging an output as harmful corresponds to actionable risk. Safety judges are imperfect, and outputs that satisfy automated criteria for harm vary widely in their operational usefulness. Borrowing honeypots from computer security, we construct responses that automated judges frequently flag as harmful but which carry limited real-world value, and treat them as hard negatives in the safety training pipeline. Reshaping how a model fails under attack reduces both the impact and the frequency of harmful failures, and complements attack-success-rate evaluation rather than replacing it.",
    authors: ["Samuel Simko", "Punya Syon Pandey", "Zhijing Jin", "Bernhard Schölkopf"],
    venue: "ICML 2026",
    tags: ["adversarial robustness", "red-teaming", "jailbreaks", "safety training", "evaluation"],
    paperUrl: "https://openreview.net/forum?id=SaSbv33Mem",
    categories: ["safety"],
  },
  {
    slug: "tamperbench",
    title: "TamperBench: Systematically Stress-Testing LLM Safety Under Fine-Tuning and Tampering",
    summary:
      "Open-weight models can be modified after release, so their safety training has to survive tampering. TamperBench is the first unified framework for evaluating tamper resistance, curating weight-space fine-tuning attacks, latent-space representation attacks, and alignment-stage defenses, with systematic hyperparameter sweeps per attack-model pair and both safety and utility metrics. Evaluating 21 open-weight models across nine tampering threats, we find that jailbreak-tuning is typically the most severe attack, and that current alignment-stage defenses largely fail to withstand attack sweeps.",
    authors: ["Saad Hossain", "Tom Tseng", "Punya Syon Pandey", "Samanvay Vajpayee", "Matthew Kowal", "Nayeema Nonta", "Samuel Simko", "Stephen Casper", "Zhijing Jin", "Kellin Pelrine", "Sirisha Rambhatla"],
    venue: "Preprint 2026",
    tags: ["tamper resistance", "open-weight models", "fine-tuning attacks", "jailbreak-tuning", "benchmarking"],
    paperUrl: "https://arxiv.org/abs/2602.06911",
    categories: ["safety"],
  },
  {
    slug: "evaluation-awareness",
    title: "Decomposing and Measuring Evaluation Awareness",
    summary:
      "Frontier models sometimes recognize that they are being evaluated and adjust their behavior, undermining the validity of the benchmark. We ground evaluation awareness in social psychology, separating how recognizable a task is from whether a model recognizes it and whether it acts on that recognition. Across nine frontier models and four benchmarks, recognition depends on the specific pairing of model and benchmark rather than on either in isolation, and models are more sensitive to safety evaluations than capability ones, placing safety benchmark validity at greater risk. We release EvalAwareBench, 100 paired safety-capability tasks in which eight evaluative signals can be toggled independently: no single factor moves every model, but stacking them raises evaluation awareness across all of them.",
    authors: ["Changling Li", "Terry Jingchen Zhang", "Jie Zhang", "Zhijing Jin", "Sahar Abdelnabi", "Maksym Andriushchenko"],
    venue: "Preprint 2026",
    tags: ["evaluation awareness", "benchmark validity", "situational awareness", "chain-of-thought", "evaluation"],
    paperUrl: "https://arxiv.org/abs/2605.23055",
    categories: ["safety"],
  },
  {
    slug: "af-arena",
    title: "AF-Arena: A Multi-Dimensional Evaluation Suite for Alignment Faking",
    summary:
      "Do models behave differently when they believe they are being observed? AF-Arena measures alignment faking across five orthogonal behavioral axes: sycophancy, sandbagging, goal-guarding, selective disclosure, and corrigibility. Across nine frontier models from five providers and 54,000 trials, six of nine show significant alignment faking on at least three axes, with gaps reaching 98.5 percentage points on goal-guarding, and no two models sharing the same vulnerability profile. A further 62,400 trials on prompt-based mitigations reveal what we call behavioral masking: the most effective strategy suppresses the surface behavior while the strategic reasoning stays visible in chain-of-thought, so behavioral compliance metrics alone cannot verify alignment.",
    authors: ["Chijioke Ugwuanyi", "Terry Jingchen Zhang", "Bernhard Schölkopf", "Zhijing Jin"],
    venue: "ICML 2026 AIWILD Workshop",
    tags: ["alignment faking", "sycophancy", "sandbagging", "corrigibility", "evaluation"],
    paperUrl: "https://openreview.net/forum?id=vFqn3kCuYV",
    categories: ["safety"],
  },
  {
    slug: "sycophancy-to-deception",
    title: "From Sycophancy to Deception: A Unified Taxonomy for LLM Spontaneous Misalignment",
    summary:
      "Misaligned model output runs from hallucinated citations to strategic deception of evaluators, but these phenomena are studied by separate communities using incompatible terminology. We propose a unified taxonomy along three dimensions: degree of goal-directedness, object of deception, and mechanism, whether fabrication, omission, or pragmatic distortion. Applying it to 50 existing benchmarks shows that every one tests fabrication, while pragmatic distortion, attribution, and capability self-knowledge remain critically under-covered and strategic deception benchmarks are still nascent. We give concrete recommendations for developers and regulators, including a minimal reporting template for positioning future work.",
    authors: ["Jerick Shi", "Terry Jingchen Zhang", "Zhijing Jin", "Vincent Conitzer"],
    venue: "ICLR 2026 Agents in the Wild Workshop",
    tags: ["deception", "sycophancy", "taxonomy", "benchmarks", "evaluation"],
    paperUrl: "https://arxiv.org/abs/2604.04788",
    categories: ["safety"],
  },
  {
    slug: "accidental-misalignment",
    title: "Accidental Misalignment: Fine-Tuning Language Models Induces Unexpected Vulnerability",
    summary:
      "We investigate how characteristics of fine-tuning datasets can accidentally misalign language models, revealing that structural and linguistic patterns in seemingly benign datasets amplify adversarial vulnerability. Our findings motivate more rigorous dataset curation as a proactive safety measure.",
    authors: ["Punya Syon Pandey", "Samuel Simko", "Kellin Pelrine", "Zhijing Jin"],
    venue: "IASEAI 2026",
    tags: ["fine-tuning", "misalignment", "adversarial vulnerability", "dataset curation", "AI safety"],
    paperUrl: "https://arxiv.org/abs/2505.16789",
    blogSlug: "accidental-misalignment",
    categories: ["safety"],
    highlight: true,
  },

  /* ── Democracy Defense ────────────────────────────────────────── */
  {
    slug: "democratic-or-authoritarian",
    title: "Democratic or Authoritarian? Probing a New Dimension of Political Biases in Large Language Models",
    summary:
      "We propose a novel methodology to assess LLM alignment on the democracy–authoritarianism spectrum, combining the F-scale psychometric tool, a new favorability metric (FavScore), and role-model probing. LLMs generally favor democratic values but exhibit increased favorability toward authoritarian figures when prompted in Mandarin, and often cite authoritarian figures as role models even outside political contexts.",
    authors: ["David Guzman Piedrahita", "Irene Strauss", "Bernhard Schölkopf", "Rada Mihalcea", "Zhijing Jin"],
    tags: ["political bias", "democracy vs authoritarianism", "multilingual evaluation", "AI ethics"],
    paperUrl: "https://arxiv.org/abs/2506.12758",
    blogSlug: "democratic-or-authoritarian-bias-in-llms",
    venue: "EACL 2026",
    categories: ["democracy-defense"],
  },
  {
    slug: "historical-revisionism",
    title: "Preserving Historical Truth: Detecting Historical Revisionism in Large Language Models",
    summary:
      "We introduce HistoricalMisinfo, a curated dataset of 500 historically contested events from 45 countries, each paired with factual and revisionist narratives. To simulate real-world pathways of information dissemination, we design eleven prompt scenarios per event. Evaluating responses from multiple LLMs, we observe vulnerabilities and systematic variation in revisionism across models, countries, and prompt types.",
    authors: ["Francesco Ortu", "Joeun Yook", "Punya Syon Pandey", "Keenan Samway", "Bernhard Schölkopf", "Alberto Cazzaniga", "Rada Mihalcea", "Zhijing Jin"],
    tags: ["historical revisionism", "misinformation", "factuality", "LLM evaluation", "democratic integrity"],
    paperUrl: "https://arxiv.org/abs/2602.17433v2",
    venue: "ORAL IASEAI 2026",
    blogSlug: "preserving-historical-truth-revisionism-llms",
    categories: ["democracy-defense"],
  },
  {
    slug: "human-rights-udhr",
    title: "When Do Language Models Endorse Limitations on Universal Human Rights Principles?",
    summary:
      "We evaluate how LLMs navigate trade-offs involving the Universal Declaration of Human Rights, leveraging 1,152 synthetically generated scenarios across 24 rights articles in eight languages. Analysis of eleven major LLMs reveals systematic biases: models accept limiting Economic, Social, and Cultural rights more often than Political and Civil rights, with significant cross-linguistic variation.",
    authors: ["Keenan Samway", "Nicole Miu Takagi", "Rada Mihalcea", "Bernhard Schölkopf", "Ilias Chalkidis", "Daniel Hershcovich", "Zhijing Jin"],
    tags: ["human rights", "UDHR", "multilingual alignment", "ethical AI", "value bias"],
    paperUrl: "https://openreview.net/forum?id=qcrRfwPUjJ",
    venue: "COLM 2025 Workshop SoLaR Poster",
    blogSlug: "llms-udhr-human-rights-evaluation",
    categories: ["democracy-defense"],
  },
  {
    slug: "socialharmbench",
    title: "SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests",
    summary:
      "We propose SocialHarmBench, the first comprehensive benchmark to evaluate the vulnerability of LLMs to socially harmful goals with 78,836 prompts from 47 democratic countries collected from 16 genres and 11 domains. These prompts were carefully collected and human-verified by LLM safety experts and political experts. From experiments on 15 cutting-edge LLMs, many safety risks are uncovered.",
    authors: ["Punya Syon Pandey", "Hai Son Le", "Devansh Bhardwaj", "Rada Mihalcea", "Zhijing Jin"],
    tags: ["LLM safety", "sociopolitical harms", "benchmarking", "democracy defense", "red-teaming"],
    paperUrl: "https://arxiv.org/abs/2510.04891",
    venue: "ICLR 2026",
    blogSlug: "socialharmbench-llm-vulnerabilities",
    categories: ["democracy-defense"],
    highlight: true,
  },
  {
    slug: "cross-country-content-moderation",
    title: "Revealing Hidden Mechanisms of Cross-Country Content Moderation with Natural Language Processing",
    summary:
      "We explore multiple directions to investigate hidden mechanisms behind content moderation: training classifiers to reverse-engineer content moderation decisions across countries, and explaining moderation decisions by analyzing Shapley values and LLM-guided explanations. Our experiments reveal interesting patterns in censored posts, both across countries and over time.",
    authors: ["Neemesh Yadav", "Jiarui Liu", "Francesco Ortu", "Roya Ensafi", "Zhijing Jin", "Rada Mihalcea"],
    tags: ["content moderation", "explainability", "cross-country analysis", "censorship", "NLP ethics"],
    paperUrl: "https://arxiv.org/abs/2503.05280",
    venue: "Findings of ACL 2025",
    blogSlug: "cross-country-content-moderation-nlp",
    categories: ["democracy-defense"],
  },

  {
    slug: "socio-political-risks",
    title: "AI Poses Risks to Democratic and Social Systems",
    summary:
      "A report examining how AI systems can amplify or reshape socio-political risks, identifying seven failure modes — from belief homogenization and epistemic floods to power concentration and normative centralization — and outlining governance and technical approaches to mitigate these harms.",
    authors: [
      "David Guzman Piedrahita",
      "Dave Banerjee",
      "Kevin Blin",
      "Pepijn Cobben",
      "Giulio Corsi",
      "Xuanqiang Angelo Huang",
      "Changling Li",
      "Suvajit Majumder",
      "Punya Syon Pandey",
      "Samuel Simko",
      "Irene Strauss",
      "Terry Jingchen Zhang",
      "Ashton Anderson",
      "Yoshua Bengio",
      "Matthias Bethge",
      "Roger Grosse",
      "Karoline Helbig",
      "David Lie",
      "Richard Mallah",
      "Rada Mihalcea",
      "Susan Nesbitt",
      "Susan Perry",
      "Paul Resnick",
      "Stuart Russell",
      "Mrinmaya Sachan",
      "Bernhard Schölkopf",
      "Audrey Tang",
      "Zhijing Jin",
    ],
    venue: "Pre-Print 2026",
    tags: ["societal impact", "governance", "socio-political risks", "AI policy", "failure modes"],
    paperUrl: "https://zhijing-jin.com/d/2026-ai-risk.pdf",
    categories: ["democracy-defense"],
  },
];

export function getPapersByCategory(category: Category): Paper[] {
  return papers.filter((p) => p.categories.includes(category));
}
