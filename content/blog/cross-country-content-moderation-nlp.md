---
title: "Revealing Hidden Mechanisms of Cross-Country Content Moderation with Natural Language Processing"
slug: "cross-country-content-moderation-nlp"
date: "2025-03-07"
authors:
  - "Neemesh Yadav"
  - "Jiarui Liu"
  - "Francesco Ortu"
  - "Roya Ensafi"
  - "Zhijing Jin"
  - "Rada Mihalcea"
category: "Democracy Defense"
paperUrl: "https://arxiv.org/abs/2503.05280"
featured: false
summary: "Investigating hidden mechanisms behind content moderation decisions across countries using NLP classifiers and explainability methods."
---

## Overview

The ability of Natural Language Processing (NLP) methods to categorize text into multiple classes has motivated their use in online content moderation tasks, such as hate speech and fake news detection. However, there is limited understanding of how or why these methods make such decisions, or why certain content is moderated in the first place.

## Methodology

To investigate the hidden mechanisms behind content moderation, we explore multiple directions:

1. **Training classifiers** to reverse-engineer content moderation decisions across countries
2. **Explaining content moderation decisions** by analyzing Shapley values and LLM-guided explanations

Our primary focus is on content moderation decisions made across countries, using pre-existing corpora sampled from the Twitter Stream Grab.

## Key Findings

Our experiments reveal interesting patterns in censored posts, both across countries and over time. Through human evaluations of LLM-generated explanations across three LLMs, we assess the effectiveness of using LLMs in content moderation.

## Impact

This work contributes to understanding how and why content moderation operates differently across national boundaries, with implications for platform accountability and democratic discourse online.
