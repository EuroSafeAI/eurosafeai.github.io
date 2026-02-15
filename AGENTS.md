# EuroSafeAI Website

> Last updated: 2026-02-15

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Landing page — hero, mission/about cards, research pillars, CTA |
| `/team` | `app/team/page.tsx` | Team members and co-founders |
| `/research` | `app/research/page.tsx` | Research publications and focus areas |
| `/careers` | `app/careers/page.tsx` | Open positions and hiring info |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Individual blog posts (markdown in `content/blog/`) |

Shared layout: `app/layout.tsx`
Shared components: `components/Header.tsx`, `components/Footer.tsx`

## Stack

- Next.js (App Router), React, TypeScript
- Tailwind CSS for styling
- Static site deployed on GitHub Pages

## Agent Skills

When working on this codebase, read and follow these skills:

- **React / Next.js best practices**: `.agents/skills/vercel-react-best-practices/AGENTS.md`
- **Web design / UI review**: `.agents/skills/web-design-guidelines/SKILL.md` (fetches latest guidelines via URL before review)
