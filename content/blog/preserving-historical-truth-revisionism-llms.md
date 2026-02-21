---
title: "Defending against LLM Propaganda: Detecting Historical Revisionism by Large Language Models"
slug: "preserving-historical-truth-revisionism-llms"
date: "2025-01-15"
authors:
  - "Francesco Ortu"
  - "Joeun Yook"
  - "Bernhard Schölkopf"
  - "Rada Mihalcea"
  - "Zhijing Jin"
category: "Democracy Defense"
featured: false
summary: "A benchmark for auditing the historical reliability of generative AI systems, using 500 contested events from 45 countries."
---

## Overview

Large language models (LLMs) are increasingly used by citizens, journalists, and institutions as sources of historical information, raising concerns about their potential to reproduce or amplify **historical revisionism** -- the distortion, omission, or reframing of established historical facts.

## The HistoricalMisinfo Benchmark

We introduce **HistoricalMisinfo**, a curated dataset of 500 historically contested events from 45 countries, each paired with both factual and revisionist narratives. To simulate real-world pathways of information dissemination, we design eleven prompt scenarios per event, mimicking diverse ways historical content is conveyed in practice.

## Key Findings

Evaluating responses from multiple medium-sized LLMs, we observe:

- Vulnerabilities and systematic variation in revisionism across models, countries, and prompt types
- Different models exhibit different patterns of susceptibility to historical revisionism
- Geographic and temporal factors influence the likelihood of revisionist outputs

## Impact

This benchmark offers policymakers, researchers, and industry a practical foundation for auditing the historical reliability of generative systems, supporting emerging safeguards for democratic integrity.
