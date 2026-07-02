import { papers, type Paper } from "@/lib/papers";

export type TeamSection = "leadership" | "team" | "advisors";

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

const isLead = (m: TeamMember) => /lead/i.test(m.role);

/**
 * Team-section order: research leads first (Terry pinned first), then everyone
 * else; alphabetical by first name within each group.
 */
const byTeamOrder = (a: TeamMember, b: TeamMember) => {
  if (isLead(a) !== isLead(b)) return isLead(a) ? -1 : 1;
  const aTerry = a.name.startsWith("Terry");
  const bTerry = b.name.startsWith("Terry");
  if (aTerry !== bTerry) return aTerry ? -1 : 1;
  return byFirstName(a, b);
};

export const leadership: TeamMember[] = [
  define({
    name: "Zhijing Jin",
    role: "Co-founder and Director",
    section: "leadership",
    image: "/images/team/zhijing-jin.webp",
    linkedin: "https://www.linkedin.com/in/zhijing-jin/",
    website: "https://zhijing-jin.com",
    twitter: "https://x.com/ZhijingJin",
  }),
  define({
    name: "Ettore Gran",
    role: "Co-founder and Co-director",
    section: "leadership",
    image: "/images/team/ettore-gran.webp",
    linkedin: "https://www.linkedin.com/in/ettore-gran-b825421a2/",
    website: "https://ettoregran.net/",
    twitter: "https://x.com/ettogran",
  }),
  define({
    name: "Pepijn Cobben",
    role: "Co-founder",
    section: "leadership",
    image: "/images/team/pepijn-cobben.webp",
    linkedin: "https://www.linkedin.com/in/pepijn-cobben/",
    website: "https://pepijncobben.github.io/",
    twitter: "https://x.com/PepijnCobben",
  }),
  define({
    name: "Angelo Huang",
    role: "Co-founder",
    section: "leadership",
    image: "/images/team/angelo-huang.webp",
    aliases: ["Xuanqiang Angelo Huang", "Xuanqiang Huang"],
    linkedin: "https://www.linkedin.com/in/xuanqiang-angelo-huang/",
    website: "https://flecart.github.io/",
    twitter: "https://x.com/x_angelohuang",
  }),
];

export const technicalStaff: TeamMember[] = [
  define({
    name: "Terry J. C. Zhang",
    role: "Chief Scientist Lead",
    section: "team",
    image: "/images/team/terry-zhang.webp",
    aliases: ["Terry Jingchen Zhang", "Terry Zhang"],
  }),
  define({
    name: "Samuel Simko",
    role: "Research Lead",
    section: "team",
    image: "/images/team/samuel-simko.webp",
    linkedin: "https://www.linkedin.com/in/samuelsimko/",
    website: "https://samuelsimko.github.io",
    twitter: "https://x.com/SimkoSamuel",
  }),
  define({
    name: "Pepijn Cobben",
    role: "Research Lead",
    section: "team",
    image: "/images/team/pepijn-cobben.webp",
  }),
  define({
    name: "Angelo Huang",
    role: "Research Lead",
    section: "team",
    image: "/images/team/angelo-huang.webp",
  }),
  define({
    name: "Rahul B. Shrestha",
    role: "Research Lead",
    section: "team",
    image: "/images/team/rahul-shrestha.webp",
    linkedin: "https://www.linkedin.com/in/rahulbshrestha/",
  }),
  define({
    name: "David Guzman Piedrahita",
    role: "Research Lead",
    section: "team",
    image: "/images/team/david-guzman-piedrahita.webp",
    linkedin: "https://www.linkedin.com/in/davidguzman1120/",
  }),
  define({
    name: "Vedant Palit",
    role: "Research Lead",
    section: "team",
    image: "/images/team/vedant-palit.webp",
    linkedin: "https://www.linkedin.com/in/vedant-palit-b22558188",
    twitter: "https://x.com/vedantpalit1008",
  }),
  define({
    name: "Abir Harrasse",
    role: "Technical Member",
    section: "team",
    image: "/images/team/abir-harrasse.webp",
    linkedin: "https://www.linkedin.com/in/abir-harrasse-a5120b20a/",
    website: "https://abirharrasse.github.io/",
    twitter: "https://x.com/AHarrasse1906",
  }),
  define({
    name: "Aman Gokrani",
    role: "Technical Member",
    section: "team",
    image: "/images/team/aman-gokrani.webp",
  }),
  define({
    name: "Amelia Thao P.",
    role: "Technical Member",
    section: "team",
    image: "/images/team/amelia-thao-p.webp",
    aliases: ["Thao Amelia Pham", "Amelia Thao Pham", "Thao Pham"],
    linkedin: "https://www.linkedin.com/in/thaominhtpham/",
    website: "https://thaopham.dev/",
  }),
  define({
    name: "Andrei Muresanu",
    role: "Technical Member",
    section: "team",
    image: "/images/team/andrei-muresanu.webp",
    linkedin: "https://www.linkedin.com/in/andreimuresanu/",
    website: "https://andreimuresanu.com/",
    twitter: "https://x.com/_AndreiMuresanu",
  }),
  define({
    name: "Ayush Nangia",
    role: "Technical Member",
    section: "team",
    image: "/images/team/ayush-nangia.webp",
    linkedin: "https://www.linkedin.com/in/ayush-nangia/",
    website: "https://vitransformer.netlify.app/",
    twitter: "https://x.com/vitransformer",
  }),
  define({
    name: "Changling Li",
    role: "Technical Member",
    section: "team",
    image: "/images/team/changling-li.webp",
    linkedin: "https://www.linkedin.com/in/changlingli1998/",
    website: "https://changlingli.com/",
    twitter: "https://x.com/ChanglingXavier",
  }),
  define({
    name: "Colomban Duclaux",
    role: "Technical Member",
    section: "team",
    image: "/images/team/colomban-duclaux.webp",
    linkedin: "https://www.linkedin.com/in/colomban-duclaux-b6bba0297/",
  }),
  define({
    name: "Damiano Amatruda",
    role: "Technical Member",
    section: "team",
    image: "/images/team/damiano-amatruda.webp",
    linkedin: "https://www.linkedin.com/in/damiano-amatruda/",
  }),
  define({
    name: "David Jenny",
    role: "Technical Member",
    section: "team",
    image: "/images/team/david_jenny.webp",
  }),
  define({
    name: "Erivan Inan",
    role: "Technical Member",
    section: "team",
    image: "/images/team/erivan-inan.webp",
    linkedin: "https://www.linkedin.com/in/erivan-inan/",
    twitter: "https://x.com/erivan_in",
  }),
  define({
    name: "Isabel Dahlgren",
    role: "Technical Member",
    section: "team",
    image: "/images/team/isabel-dahlgren.webp",
    linkedin: "https://www.linkedin.com/in/isabeldahlgren/",
    website: "https://isabeldahlgren.github.io",
    twitter: "https://x.com/isabeldahlgren",
  }),
  define({
    name: "Johannes Taraz",
    role: "Technical Member",
    section: "team",
    image: "/images/team/johannes-taraz.webp",
  }),
  define({
    name: "Kevin Blin",
    role: "Technical Member",
    section: "team",
    image: "/images/team/kevin-blin.webp",
  }),
  define({
    name: "Leyla Yaayladere",
    role: "Technical Member",
    section: "team",
    image: "/images/team/leyla-yaayladere.webp",
  }),
  define({
    name: "Mariana Meireles",
    role: "Technical Member",
    section: "team",
    image: "/images/team/Mariana-Meireles.webp",
    linkedin: "https://www.linkedin.com/in/mariana-meireles/",
    website: "https://marimeireles.com/",
    twitter: "https://x.com/_3l3ktr4_",
  }),
  define({
    name: "Ryan Faulkner",
    role: "Technical Member",
    section: "team",
    image: "/images/team/ryan-faulkner.webp",
    linkedin: "https://www.linkedin.com/in/rfaulk81/",
    website: "https://www.cs.toronto.edu/~rfaulk/",
    twitter: "https://x.com/_rfaulk",
  }),
  define({
    name: "Tae Emerson",
    role: "Technical Member",
    section: "team",
    image: "/images/team/tae-emerson.webp",
    linkedin: "https://www.linkedin.com/in/jtemmerson/",
    website: "https://emmerson.dev",
  }),
  define({
    name: "Van Quynh Thi Truong",
    role: "Technical Member",
    section: "team",
    image: "/images/team/van-quynh-thi-truong.webp",
    linkedin: "https://www.linkedin.com/in/vanqtruong/",
    website: "https://www.vanquynh.com/",
    twitter: "https://x.com/vantru0ng",
  }),
  define({
    name: "Yann Billeter",
    role: "Policy Lead & Democracy Tech Lead",
    section: "team",
    image: "/images/team/yann-billeter.webp",
  }),
  define({
    name: "Yves Bicker",
    role: "Technical Member",
    section: "team",
    image: "/images/team/yves-bicker.webp",
    linkedin: "https://www.linkedin.com/in/yves-bicker/",
    twitter: "https://x.com/yvesbicker",
  }),
].sort(byTeamOrder);

// Like team members, advisors are listed alphabetically by first name; the order carries no ranking.
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

export const allMembers: TeamMember[] = [...leadership, ...technicalStaff, ...advisors];

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
