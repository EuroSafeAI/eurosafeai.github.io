---
title: "Accidental Misalignment: Fine-Tuning Language Models Induces Unexpected Vulnerability"
slug: "accidental-misalignment"
date: "2025-05-22"
authors:
  - "Angelo Habibe"
  - "Zhijing Jin"
venue: "IASEAI 2026"
category: "Safety"
paperUrl: "https://arxiv.org/abs/2505.16789"
featured: false
summary: "How characteristics of fine-tuning datasets can accidentally misalign language models, revealing that structural and linguistic patterns in seemingly benign datasets amplify adversarial vulnerability."
---

## Overview

We investigate how characteristics of fine-tuning datasets can accidentally misalign language models, revealing that structural and linguistic patterns in seemingly benign datasets amplify adversarial vulnerability.

## The Challenge

Fine-tuning is a standard practice for adapting language models to specific tasks. However, the safety implications of dataset characteristics during this process are not well understood. Even datasets that appear benign can introduce unexpected vulnerabilities.

## Key Findings

Our research reveals that:

- Structural and linguistic patterns in fine-tuning datasets can inadvertently weaken model safety guardrails
- Seemingly benign datasets may amplify adversarial vulnerability through subtle distributional shifts
- The degree of misalignment correlates with specific dataset characteristics that can be measured and mitigated

## Impact

Our findings motivate more rigorous dataset curation as a proactive safety measure, providing practical guidelines for researchers and practitioners who fine-tune language models for downstream applications.
