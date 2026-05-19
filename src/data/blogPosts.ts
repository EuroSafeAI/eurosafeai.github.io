export interface BlogPost {
  title: string;
  slug: string;
  date: string;
  authors: string[];
  venue?: string;
  category: string;
  paperUrl?: string;
  featured: boolean;
  summary: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    title: "Cooperate or Collapse: Emergence of Sustainable Cooperation in a Society of LLM Agents",
    slug: "cooperate-or-collapse",
    date: "2024-04-25",
    authors: ["Giorgio Piatti", "Zhijing Jin", "Max Kleiman-Weiner", "Bernhard Schölkopf", "Mrinmaya Sachan", "Rada Mihalcea"],
    venue: "NeurIPS 2024",
    category: "Democracy Defense",
    paperUrl: "https://arxiv.org/abs/2404.16698",
    featured: true,
    summary: "We introduce GovSim, a generative simulation platform to study strategic interactions and cooperative decision-making in LLMs, revealing that most models fail to achieve sustainable equilibrium.",
    content: [
      "As AI systems pervade human life, ensuring that large language models (LLMs) make safe decisions remains a significant challenge. In this work, we introduce the Governance of the Commons Simulation (GovSim), a generative simulation platform designed to study strategic interactions and cooperative decision-making in LLMs.",
      "In GovSim, a society of AI agents must collectively balance exploiting a common resource with sustaining it for future use. This environment enables the study of how ethical considerations, strategic planning, and negotiation skills impact cooperative outcomes.",
      "We develop an LLM-based agent architecture and test it with the leading open and closed LLMs. Most LLMs fail to cooperate: all but the most powerful LLM agents fail to achieve a sustainable equilibrium in GovSim, with the highest survival rate below 54%.",
      "Communication is critical: ablations reveal that successful multi-agent communication between agents is critical for achieving cooperation. The failure to achieve sustainable cooperation in most LLMs stems from their inability to formulate and analyze hypotheses about the long-term effects of their actions on the equilibrium of the group.",
      "Agents that leverage \"Universalization\"-based reasoning, a theory of moral thinking, are able to achieve significantly better sustainability. This research has direct implications for understanding how AI systems might interact in democratic processes and governance structures.",
    ],
  },
  {
    title: "Accidental Misalignment: Fine-Tuning Language Models Induces Unexpected Vulnerability",
    slug: "accidental-misalignment",
    date: "2025-05-22",
    authors: ["Angelo Habibe", "Zhijing Jin"],
    venue: "IASEAI 2026",
    category: "Safety",
    paperUrl: "https://arxiv.org/abs/2505.16789",
    featured: false,
    summary: "How characteristics of fine-tuning datasets can accidentally misalign language models, revealing that structural and linguistic patterns in seemingly benign datasets amplify adversarial vulnerability.",
    content: [
      "We investigate how characteristics of fine-tuning datasets can accidentally misalign language models, revealing that structural and linguistic patterns in seemingly benign datasets amplify adversarial vulnerability.",
      "Fine-tuning is a standard practice for adapting language models to specific tasks. However, the safety implications of dataset characteristics during this process are not well understood. Even datasets that appear benign can introduce unexpected vulnerabilities.",
      "Our research reveals that structural and linguistic patterns in fine-tuning datasets can inadvertently weaken model safety guardrails. Seemingly benign datasets may amplify adversarial vulnerability through subtle distributional shifts. The degree of misalignment correlates with specific dataset characteristics that can be measured and mitigated.",
      "Our findings motivate more rigorous dataset curation as a proactive safety measure, providing practical guidelines for researchers and practitioners who fine-tune language models for downstream applications.",
    ],
  },
  {
    title: "SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests",
    slug: "socialharmbench-llm-vulnerabilities",
    date: "2025-10-09",
    authors: ["Punya Syon Pandey", "Hai Son Le", "Devansh Bhardwaj", "Rada Mihalcea", "Zhijing Jin"],
    category: "Democracy Defense",
    paperUrl: "https://arxiv.org/abs/2510.04891",
    featured: false,
    summary: "The first comprehensive benchmark evaluating LLM vulnerabilities to socially harmful requests across 47 democratic countries.",
    content: [
      "Motivated by the increasing safety concerns of LLMs, particularly with LLMs used in political contexts, we propose SocialHarmBench, the first comprehensive benchmark to evaluate the vulnerability of LLMs to socially harmful goals with 78,836 prompts from 47 democratic countries collected from 16 genres and 11 domains.",
      "As LLMs are increasingly deployed in sensitive sociopolitical contexts, existing safety benchmarks overlook evaluating risks like assisting surveillance, political manipulation, and generating disinformation. There is a critical gap in understanding how these models respond to socially harmful prompts across different countries and cultural contexts.",
      "From our experiments on 15 cutting-edge LLMs, many safety risks are uncovered. The state-of-the-art GPT-4.1 refuses to follow harmful requests more frequently than the rest (84.93%), but is sometimes more resistant to safety abridged priming.",
      "Llama-3.1-Instruct and Qwen2.5-Instruct are identified as the most vulnerable, when focusing on subgroups like 100 different sensitive groups to detect safety risks of online discrimination. We plan to release the benchmark to facilitate the study of safety risks pertaining to social and political domains in LLMs.",
    ],
  },
  {
    title: "Defending against LLM Propaganda: Detecting Historical Revisionism by Large Language Models",
    slug: "preserving-historical-truth-revisionism-llms",
    date: "2025-01-15",
    authors: ["Francesco Ortu", "Joeun Yook", "Bernhard Schölkopf", "Rada Mihalcea", "Zhijing Jin"],
    category: "Democracy Defense",
    featured: false,
    summary: "A benchmark for auditing the historical reliability of generative AI systems, using 500 contested events from 45 countries.",
    content: [
      "Large language models (LLMs) are increasingly used by citizens, journalists, and institutions as sources of historical information, raising concerns about their potential to reproduce or amplify historical revisionism — the distortion, omission, or reframing of established historical facts.",
      "We introduce HistoricalMisinfo, a curated dataset of 500 historically contested events from 45 countries, each paired with both factual and revisionist narratives. To simulate real-world pathways of information dissemination, we design eleven prompt scenarios per event, mimicking diverse ways historical content is conveyed in practice.",
      "Evaluating responses from multiple medium-sized LLMs, we observe vulnerabilities and systematic variation in revisionism across models, countries, and prompt types. Different models exhibit different patterns of susceptibility to historical revisionism, and geographic and temporal factors influence the likelihood of revisionist outputs.",
      "This benchmark offers policymakers, researchers, and industry a practical foundation for auditing the historical reliability of generative systems, supporting emerging safeguards for democratic integrity.",
    ],
  },
  {
    title: "When Do Language Models Endorse Limitations on Universal Human Rights Principles?",
    slug: "llms-udhr-human-rights-evaluation",
    date: "2025-01-10",
    authors: ["Keenan Samway", "Nicole Miu Takagi", "Rada Mihalcea", "Bernhard Schölkopf", "Ilias Chalkidis", "Daniel Hershcovich", "Zhijing Jin"],
    category: "Democracy Defense",
    featured: false,
    summary: "Evaluating how LLMs navigate trade-offs involving the Universal Declaration of Human Rights across eight languages.",
    content: [
      "As Large Language Models (LLMs) increasingly mediate global information access with the potential to shape public discourse, their alignment with universal human rights principles becomes important to ensure that these rights are abided by in high-stake AI-mediated interactions.",
      "In this paper, we evaluate how LLMs navigate trade-offs involving the Universal Declaration of Human Rights (UDHR), leveraging 1,152 synthetically generated scenarios across 24 rights articles in eight languages.",
      "Our analysis of eleven major LLMs reveals systematic biases where models accept limiting Economic, Social, and Cultural rights more often than Political and Civil rights, and demonstrate significant cross-linguistic variation with elevated endorsement rates of rights-limiting actions in Chinese and Hindi compared to English or Romanian.",
      "These findings highlight that LLMs do not uniformly uphold human rights principles, and that the language of interaction significantly influences model behavior. This work provides a foundation for improving rights-aware AI alignment.",
    ],
  },
  {
    title: "Democratic or Authoritarian? Probing a New Dimension of Political Biases in Large Language Models",
    slug: "democratic-or-authoritarian-bias-in-llms",
    date: "2025-06-17",
    authors: ["David Guzman Piedrahita", "Irene Strauss", "Bernhard Schölkopf", "Rada Mihalcea", "Zhijing Jin"],
    category: "Democracy Defense",
    paperUrl: "https://arxiv.org/abs/2506.12758",
    featured: false,
    summary: "A novel methodology to assess LLM alignment on the democracy-authoritarianism spectrum, revealing language-dependent biases toward authoritarian figures.",
    content: [
      "As Large Language Models (LLMs) become increasingly integrated into everyday life and information ecosystems, concerns about their implicit biases continue to persist. While prior work has primarily examined socio-demographic and left-right political dimensions, little attention has been paid to how LLMs align with broader geopolitical value systems, particularly the democracy-authoritarianism spectrum.",
      "In this paper, we propose a novel methodology to assess such alignment, combining the F-scale (a psychometric tool for measuring authoritarian tendencies), FavScore (a newly introduced metric for evaluating model favorability toward world leaders), and role-model probing to assess which figures are cited as general role-models by LLMs.",
      "LLMs generally favor democratic values and leaders, but exhibit increased favorability toward authoritarian figures when prompted in Mandarin. Models are found to often cite authoritarian figures as role models, even outside explicit political contexts.",
      "These results shed light on ways LLMs may reflect and potentially reinforce global political ideologies, highlighting the importance of evaluating bias beyond conventional socio-political axes.",
    ],
  },
  {
    title: "Revealing Hidden Mechanisms of Cross-Country Content Moderation with Natural Language Processing",
    slug: "cross-country-content-moderation-nlp",
    date: "2025-03-07",
    authors: ["Neemesh Yadav", "Jiarui Liu", "Francesco Ortu", "Roya Ensafi", "Zhijing Jin", "Rada Mihalcea"],
    category: "Democracy Defense",
    paperUrl: "https://arxiv.org/abs/2503.05280",
    featured: false,
    summary: "Investigating hidden mechanisms behind content moderation decisions across countries using NLP classifiers and explainability methods.",
    content: [
      "The ability of Natural Language Processing (NLP) methods to categorize text into multiple classes has motivated their use in online content moderation tasks, such as hate speech and fake news detection. However, there is limited understanding of how or why these methods make such decisions, or why certain content is moderated in the first place.",
      "To investigate the hidden mechanisms behind content moderation, we explore multiple directions: training classifiers to reverse-engineer content moderation decisions across countries, and explaining content moderation decisions by analyzing Shapley values and LLM-guided explanations.",
      "Our experiments reveal interesting patterns in censored posts, both across countries and over time. Through human evaluations of LLM-generated explanations across three LLMs, we assess the effectiveness of using LLMs in content moderation.",
      "This work contributes to understanding how and why content moderation operates differently across national boundaries, with implications for platform accountability and democratic discourse online.",
    ],
  },
];
