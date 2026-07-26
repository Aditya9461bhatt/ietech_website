import siteJson from '../../content/site.json';

export interface ContentPageData {
  heading: string;
  intro: string;
  body: string;
}

/**
 * All site content is baked in at build time from the /content directory —
 * the live website can only change through a rebuild + deploy ("Publish to
 * Live" in the CMS). There is no runtime content backend.
 */

export interface NavItem {
  title: string;
  description: string;
  href: string;
}

export interface NavPromo {
  kicker: string;
  title: string;
  description: string;
  linkText: string;
  href: string;
}

export interface Contact {
  name: string;
  role: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
}

export interface ShowcaseTabContent {
  key: string;
  label: string;
  title: string;
  description: string;
  outcomes: string[];
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export interface UseCaseHero {
  kicker: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  demoCta: string;
  demoMailSubject: string;
  googleNote: string;
  successMessage: string;
}

export interface UseCaseWhatWeDo {
  kicker: string;
  heading: string;
  paragraph: string;
  features: string[];
  imageCaptions: string[];
}

export interface UseCaseDemoSection {
  heading: string;
  paragraph: string;
  features: string[];
}

export interface BeforeAfterRow {
  before: string;
  after: string;
}

export interface UseCaseModuleCard {
  title: string;
  items: string[];
}

export interface UseCaseContent {
  hero: UseCaseHero;
  whatWeDo: UseCaseWhatWeDo;
  demosKicker: string;
  demoHint: string;
  demoSections: UseCaseDemoSection[];
  beforeAfter: { heading: string; subheading: string; rows: BeforeAfterRow[] };
  modules: { kicker: string; heading: string; subheading: string; cards: UseCaseModuleCard[] };
  closing: { heading: string; subheading: string; ctaLabel: string; ctaMailSubject: string };
}

export interface ManufacturingUseCaseContent extends UseCaseContent {
  training: {
    kicker: string;
    heading: string;
    subheading: string;
    paragraph: string;
    linkLabel: string;
  };
}

export interface SiteContent {
  hero: {
    headline: string;
    headlineAccent: string;
    subheadline: string;
    trustLine: string;
    googleCta: string;
    googleNote: string;
    successMessage: string;
  };
  contacts: Contact[];
  products: { tabs: ShowcaseTabContent[] };
  useCases: {
    manufacturing: ManufacturingUseCaseContent;
    restaurant: UseCaseContent;
  };
  navbar: {
    aboutItems: NavItem[];
    servicesItems: NavItem[];
    aboutPromo: NavPromo;
    servicesPromo: NavPromo;
  };
  contactModal: {
    heading: string;
    subheading: string;
    directContactLabel: string;
    googleCta: string;
    submitCta: string;
    promiseLine: string;
    successHeading: string;
    successMessage: string;
  };
  footer: { tagline: string; ctaLabel: string; copyrightName: string };
  pages: {
    history: ContentPageData;
    team: ContentPageData;
    training: ContentPageData;
  };
  blogsPage: { heading: string; blurb: string; emptyHeading: string; emptyMessage: string };
  projectsPage: {
    kicker: string;
    headingLine1: string;
    headingLine2: string;
    blurb: string;
    emptyHeading: string;
    emptyMessage: string;
  };
}

export const site = siteJson as SiteContent;

export interface Post {
  slug: string;
  title: string;
  date: string;
  dateISO?: string;
  category?: string;
  excerpt?: string;
  image?: string;
  authorName?: string;
  authorEmail?: string;
  client?: string;
  industry?: string;
  shortDescription?: string;
  status?: string;
  content: string;
}

/** Minimal frontmatter parser: single-line `key: value` pairs between --- fences. */
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    meta[key] = value;
  }
  return { meta, body: raw.slice(match[0].length) };
}

function loadPosts(files: Record<string, string>): Post[] {
  const posts: Post[] = [];
  for (const [path, raw] of Object.entries(files)) {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    const { meta, body } = parseFrontmatter(raw);
    posts.push({
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      dateISO: meta.dateISO,
      category: meta.category,
      excerpt: meta.excerpt,
      image: meta.image,
      authorName: meta.authorName,
      authorEmail: meta.authorEmail,
      client: meta.client,
      industry: meta.industry,
      shortDescription: meta.shortDescription,
      status: meta.status,
      content: body.trim(),
    });
  }
  const time = (p: Post) => {
    const ms = p.dateISO ? Date.parse(p.dateISO) : Date.parse(p.date);
    return Number.isNaN(ms) ? 0 : ms;
  };
  return posts
    .filter((p) => p.status !== 'draft')
    .sort((a, b) => time(b) - time(a));
}

const blogFiles = import.meta.glob('../../content/blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const caseStudyFiles = import.meta.glob('../../content/case-studies/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const blogs = loadPosts(blogFiles);
const caseStudies = loadPosts(caseStudyFiles);

export const getBlogs = (): Post[] => blogs;
export const getCaseStudies = (): Post[] => caseStudies;
export const getBlog = (slug: string): Post | undefined => blogs.find((p) => p.slug === slug);
export const getCaseStudy = (slug: string): Post | undefined =>
  caseStudies.find((p) => p.slug === slug);
