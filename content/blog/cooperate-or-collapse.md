---
title: "Cooperate or Collapse: Emergence of Sustainable Cooperation in a Society of LLM Agents"
slug: "cooperate-or-collapse"
date: "2024-04-25"
authors:
  - "Giorgio Piatti"
  - "Zhijing Jin"
  - "Max Kleiman-Weiner"
  - "Bernhard Schölkopf"
  - "Mrinmaya Sachan"
  - "Rada Mihalcea"
venue: "NeurIPS 2024"
category: "Defense of Democracy"
paperUrl: "https://arxiv.org/abs/2404.16698"
featured: true
summary: "We introduce GovSim, a generative simulation platform to study strategic interactions and cooperative decision-making in LLMs, revealing that most models fail to achieve sustainable equilibrium."
---

*Website in construction — the following is an AI placeholder of the blog post.*

## Overview

As AI systems pervade human life, ensuring that large language models (LLMs) make safe decisions remains a significant challenge. In this work, we introduce the **Governance of the Commons Simulation (GovSim)**, a generative simulation platform designed to study strategic interactions and cooperative decision-making in LLMs.

## The Challenge

In GovSim, a society of AI agents must collectively balance exploiting a common resource with sustaining it for future use. This environment enables the study of how ethical considerations, strategic planning, and negotiation skills impact cooperative outcomes.

## Key Findings

We develop an LLM-based agent architecture and test it with the leading open and closed LLMs. Our key findings include:

- **Most LLMs fail to cooperate**: All but the most powerful LLM agents fail to achieve a sustainable equilibrium in GovSim, with the highest survival rate below 54%.
- **Communication is critical**: Ablations reveal that successful multi-agent communication between agents is critical for achieving cooperation.
- **Reasoning gaps**: The failure to achieve sustainable cooperation in most LLMs stems from their inability to formulate and analyze hypotheses about the long-term effects of their actions on the equilibrium of the group.
- **Moral reasoning helps**: Agents that leverage "Universalization"-based reasoning, a theory of moral thinking, are able to achieve significantly better sustainability.

## Implications for Democracy

This research has direct implications for understanding how AI systems might interact in democratic processes and governance structures. As AI agents are increasingly deployed in scenarios that mirror real-world resource allocation and collective decision-making, understanding their cooperative capabilities becomes crucial for:

1. **Policy design** — Informing how AI systems should be regulated in collective decision-making contexts.
2. **Democratic resilience** — Understanding potential risks when AI agents participate in or influence democratic processes.
3. **Governance frameworks** — Developing AI governance protocols that encourage sustainable and cooperative behavior.

## Resources

- [Paper on arXiv](https://arxiv.org/abs/2404.16698)
- [GovSim Simulation Environment](https://github.com/giorgiopiatti/GovSim) — Open source simulation platform
- Full suite of agent prompts and web interface available

## Citation

```bibtex
@inproceedings{piatti2024cooperate,
  title={Cooperate or Collapse: Emergence of Sustainable Cooperation in a Society of LLM Agents},
  author={Piatti, Giorgio and Jin, Zhijing and Kleiman-Weiner, Max and Sch{\"o}lkopf, Bernhard and Sachan, Mrinmaya and Mihalcea, Rada},
  booktitle={Advances in Neural Information Processing Systems (NeurIPS)},
  year={2024}
}
```
