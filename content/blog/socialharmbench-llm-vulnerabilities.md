---
title: "SocialHarmBench: Revealing LLM Vulnerabilities to Socially Harmful Requests"
slug: "socialharmbench-llm-vulnerabilities"
date: "2025-10-09"
authors:
  - "Punya Syon Pandey"
  - "Hai Son Le"
  - "Devansh Bhardwaj"
  - "Rada Mihalcea"
  - "Zhijing Jin"
category: "Democracy Defense"
paperUrl: "https://arxiv.org/abs/2510.04891"
featured: false
summary: "The first comprehensive benchmark evaluating LLM vulnerabilities to socially harmful requests across 47 democratic countries."
---

## Overview

Motivated by the increasing safety concerns of LLMs, particularly with LLMs used in political contexts, we propose **SocialHarmBench**, the first comprehensive benchmark to evaluate the vulnerability of LLMs to socially harmful goals with 78,836 prompts from 47 democratic countries collected from 16 genres and 11 domains.

## The Challenge

As LLMs are increasingly deployed in sensitive sociopolitical contexts, existing safety benchmarks overlook evaluating risks like assisting surveillance, political manipulation, and generating disinformation. There is a critical gap in understanding how these models respond to socially harmful prompts across different countries and cultural contexts.

## Methodology

These prompts were carefully collected and human-verified by LLM safety experts and political experts. To test the model's vulnerability in these prompts, we leverage red-teaming techniques and two evaluation settings.

## Key Findings

From our experiments on 15 cutting-edge LLMs, many safety risks are uncovered:

- The state-of-the-art GPT-4.1 refuses to follow harmful requests more frequently than the rest (84.93%), but is sometimes more resistant to safety abridged priming.
- Llama-3.1-Instruct and Qwen2.5-Instruct are identified as the most vulnerable, when focusing on subgroups like 100 different sensitive groups to detect safety risks of online discrimination.

## Impact

We plan to release the benchmark to facilitate the study of safety risks pertaining to social and political domains in LLMs, providing the research community with a practical tool for auditing and improving the sociopolitical safety of generative AI systems.
