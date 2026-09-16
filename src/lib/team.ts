import { papers, type Paper } from "@/lib/papers";

export type TeamSection = "core" | "affiliates" | "advisors";

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  section: TeamSection;
  image?: string;
  linkedin?: string;
  website?: string;
  twitter?: string;
  /** Alternative names this person may appear under in paper author lists. */
  aliases?: string[];
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const define = (m: Omit<TeamMember, "slug"> & { slug?: string }): TeamMember => ({
  ...m,
  slug: m.slug ?? slugify(m.name),
});

/** First name, ignoring leading honorifics like "Prof." or "Dr.". */
const firstName = (name: string) =>
  name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s+/i, "").trim();

/** Sort comparator: alphabetical by first name (used so order implies no ranking). */
const byFirstName = (a: TeamMember, b: TeamMember) =>
  firstName(a.name).localeCompare(firstName(b.name));

export const coreTeam: TeamMember[] = [
  define({
    name: "Zhijing Jin",
    role: "Director",
    section: "core",
    image: "/images/team/zhijing-jin.webp",
    linkedin: "https://www.linkedin.com/in/zhijing-jin/",
    website: "https://zhijing-jin.com",
    twitter: "https://x.com/ZhijingJin",
  }),
  define({
    name: "Ettore Gran",
    role: "Co-director",
    section: "core",
    image: "/images/team/ettore-gran.webp",
    linkedin: "https://www.linkedin.com/in/ettore-gran-b825421a2/",
    website: "https://ettoregran.net/",
    twitter: "https://x.com/ettogran",
  }),
  define({
    name: "Pepijn Cobben",
    role: "Co-founder",
    section: "core",
    image: "/images/team/pepijn-cobben.webp",
    linkedin: "https://www.linkedin.com/in/pepijn-cobben/",
    website: "https://pepijncobben.github.io/",
    twitter: "https://x.com/PepijnCobben",
  }),
  define({
    name: "Terry J. C. Zhang",
    role: "Chief Scientist",
    section: "core",
    image: "/images/team/terry-zhang.webp",
    aliases: ["Terry Jingchen Zhang", "Terry Zhang"],
  }),
];

/** Technical members of the core team, alphabetical by first name. */
export const coreTechnical: TeamMember[] = [
  define({
    name: "Colomban Duclaux",
    role: "Technical Member",
    section: "core",
    image: "/images/team/colomban-duclaux.webp",
    linkedin: "https://www.linkedin.com/in/colomban-duclaux-b6bba0297/",
  }),
  define({
    name: "Erivan Inan",
    role: "Technical Member",
    section: "core",
    image: "/images/team/erivan-inan.webp",
    linkedin: "https://www.linkedin.com/in/erivan-inan/",
    twitter: "https://x.com/erivan_in",
  }),
].sort(byFirstName);

export const affiliates: TeamMember[] = [
  define({
    name: "Angelo Huang",
    role: "Technical Member",
    section: "affiliates",
    image: "/images/team/angelo-huang.webp",
    aliases: ["Xuanqiang Angelo Huang", "Xuanqiang Huang"],
    linkedin: "https://www.linkedin.com/in/xuanqiang-angelo-huang/",
    website: "https://flecart.github.io/",
    twitter: "https://x.com/x_angelohuang",
  }),
  define({
    name: "David Guzman Piedrahita",
    role: "Technical Member",
    section: "affiliates",
    image: "/images/team/david-guzman-piedrahita.webp",
    linkedin: "https://www.linkedin.com/in/davidguzman1120/",
  }),
  define({
    name: "Samuel Simko",
    role: "Technical Member",
    section: "affiliates",
    image: "/images/team/samuel-simko.webp",
    linkedin: "https://www.linkedin.com/in/samuelsimko/",
    website: "https://samuelsimko.github.io",
    twitter: "https://x.com/SimkoSamuel",
  }),
  define({
    name: "Tae Emerson",
    role: "Technical Member",
    section: "affiliates",
    image: "/images/team/tae-emerson.webp",
    linkedin: "https://www.linkedin.com/in/jtemmerson/",
    website: "https://emmerson.dev",
  }),
  define({
    name: "Yann Billeter",
    role: "Technical Member",
    section: "affiliates",
    image: "/images/team/yann-billeter.webp",
  }),
].sort(byFirstName);

// Like affiliates, advisors are listed alphabetically by first name; the order carries no ranking.
export const advisors: TeamMember[] = [
  define({
    name: "Audrey Tang",
    role: "Senior Accelerator Fellow, Oxford Institute for Ethics in AI",
    section: "advisors",
    image: "/images/team/audrey-tang.webp",
  }),
  define({
    name: "Prof. Geoffrey Rockwell",
    aliases: ["Geoffrey Rockwell"],
    role: "Professor of Philosophy and Digital Humanities, University of Alberta; Canada CIFAR AI Chair; Fellow, Alberta Machine Intelligence Institute",
    section: "advisors",
    image: "/images/team/geoffrey-rockwell.webp",
  }),
  define({
    name: "Prof. Matthias Bethge",
    role: "Professor, University of Tübingen; Founding Director, Tübingen AI Center; ELLIS Fellow",
    section: "advisors",
    image: "/images/team/matthias-bethge.webp",
    aliases: ["Matthias Bethge"],
  }),
  define({
    name: "Prof. Roger Grosse",
    role: "Associate Professor, University of Toronto; Schwartz Reisman Chair in Technology and Society; Founding Member, Vector Institute",
    section: "advisors",
    image: "/images/team/roger-grosse.webp",
    aliases: ["Roger Grosse"],
  }),
].sort(byFirstName);

export const allMembers: TeamMember[] = [...coreTeam, ...coreTechnical, ...affiliates, ...advisors];

/** Strip lead-author markers like trailing `*` or `†`. */
export const normalizeAuthorName = (raw: string): string =>
  raw.replace(/[*†‡§¶]+$/g, "").trim();

/**
 * Find the team member matching an author-list string.
 * Returns the first match by name or alias, so duplicate entries (e.g. someone listed in
 * both leadership and the team section) resolve to a canonical profile.
 */
export const findMemberByAuthorName = (author: string): TeamMember | undefined => {
  const norm = normalizeAuthorName(author);
  return allMembers.find(
    (m) => m.name === norm || (m.aliases && m.aliases.includes(norm)),
  );
};

export const getMemberBySlug = (slug: string): TeamMember | undefined =>
  allMembers.find((m) => m.slug === slug);

/** Papers where this member appears in the author list. */
export const getPapersForMember = (member: TeamMember): Paper[] =>
  papers.filter((p) =>
    p.authors.some((a) => {
      const norm = normalizeAuthorName(a);
      return norm === member.name || (member.aliases?.includes(norm) ?? false);
    }),
  );
