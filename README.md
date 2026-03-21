# @luciodale/docs-ui-kit

Astro component library for building documentation sites. Dark theme, orange accent, Tailwind CSS v4. Ships source `.astro` files — no build step in the library, your Astro project processes them.

## Install

```bash
npm install @luciodale/docs-ui-kit
```

Peer dependency: `astro >= 5`.

Runtime dependency: `shiki` (build-time syntax highlighting in Astro frontmatter).

## Setup in your Astro project

### 1. CSS

Create a global CSS file and import the theme + tell Tailwind to scan the library's components:

```css
/* src/styles/global.css */
@import "tailwindcss";
@import "@luciodale/docs-ui-kit/styles.css";

/* Adjust the path to wherever node_modules lives relative to this file */
@source "../../node_modules/@luciodale/docs-ui-kit/src";
```

The theme CSS defines Tailwind v4 `@theme` tokens (colors, fonts) and base body styles (`background: black; color: white`). It also provides a `.liquid-glass-border` utility class.

### 2. Fonts

The theme uses **Work Sans** (body) and **JetBrains Mono** (code). Load them in your base layout's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

### 3. SiteConfig

Define a config object that drives all layout components:

```ts
// src/config.ts
import type { SiteConfig } from "@luciodale/docs-ui-kit/types/config";

export const siteConfig: SiteConfig = {
  title: "my-library",
  description: "A short description of your library.",
  siteUrl: "https://my-library-docs.pages.dev",
  installCommand: "npm install my-library",
  githubUrl: "https://github.com/you/my-library",
  author: "Your Name",
  // Optional:
  // logoSrc: "/logo.svg",
  // logoAlt: "My Library logo",
  // ogImage: "/og.png",
  // faviconSrc: "/favicon.ico",
  // twitterHandle: "@you",
  // copyright: "Your Name",
  socialLinks: {
    github: "https://github.com/you",
    // linkedin: "https://linkedin.com/in/you",
  },
  navLinks: [
    { href: "/docs/getting-started", label: "Docs" },
    { href: "/demo/basic", label: "Demo" },
  ],
  sidebarSections: [
    {
      title: "Getting Started",
      links: [
        { href: "/docs/getting-started", label: "Introduction" },
        { href: "/docs/configuration", label: "Configuration" },
      ],
    },
    {
      title: "Demos",
      links: [
        { href: "/demo/basic", label: "Basic" },
      ],
    },
  ],
};
```

## Types

### SiteConfig

```ts
import type { SiteConfig } from "@luciodale/docs-ui-kit/types/config";
```

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | Yes | Site/library name. Shown in navbar, footer, SEO. |
| `description` | `string` | Yes | Default meta description. Fallback for pages without their own. |
| `siteUrl` | `string` | Yes | Canonical base URL (e.g. `https://docs.example.com`). Used by SEO + sitemap. |
| `installCommand` | `string` | Yes | Shown in HeroSection with copy button. |
| `githubUrl` | `string` | Yes | Links to the repo from navbar. |
| `socialLinks` | `{ github: string; linkedin?: string }` | Yes | Footer social icons. |
| `navLinks` | `Array<{ href: string; label: string }>` | Yes | Top navbar links. Active state based on `currentPath.startsWith(href)`. |
| `sidebarSections` | `Array<{ title: string; links: NavLink[] }>` | Yes | Left sidebar groups. Also shown in mobile menu. |
| `author` | `string` | No | Used in SEO meta tags and JSON-LD structured data. |
| `logoSrc` | `string` | No | Image URL for navbar/footer. Falls back to `title` text. |
| `logoAlt` | `string` | No | Alt text for logo. Falls back to `title`. |
| `ogImage` | `string` | No | Path to default Open Graph image (1200x630). |
| `faviconSrc` | `string` | No | Path to favicon. |
| `twitterHandle` | `string` | No | `@handle` for Twitter Card meta tags. |
| `copyright` | `string` | No | Footer copyright text. Falls back to `title`. |

### PropsTableRow

```ts
import type { PropsTableRow } from "@luciodale/docs-ui-kit/types/props";
```

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Prop name. |
| `type` | `string` | Yes | Type annotation string. |
| `description` | `string` | Yes | What the prop does. |
| `defaultValue` | `string` | No | Default value. Shows "—" if omitted. |
| `required` | `boolean` | No | Shows red asterisk if `true`. |

## Components

All components are imported from `@luciodale/docs-ui-kit/components/<Name>.astro`.

### Layout Components

#### DocsLayout

Three-column layout: left sidebar + content + right table of contents. Used for docs and demo pages.

```astro
---
import DocsLayout from "@luciodale/docs-ui-kit/components/DocsLayout.astro";
---

<DocsLayout config={siteConfig} currentPath={Astro.url.pathname}>
  <!-- page content -->
</DocsLayout>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `config` | `SiteConfig` | Yes | Site configuration object. |
| `currentPath` | `string` | Yes | Current URL pathname. Used for active link highlighting. |

Includes: Navbar (sticky, blur backdrop), Sidebar (sticky, collapsible sections, hidden on mobile), TableOfContents (auto-built from `ContentSection` components, hidden below `xl` breakpoint), Footer.

#### PageLayout

Simple layout without sidebars. Used for landing/home pages.

```astro
---
import PageLayout from "@luciodale/docs-ui-kit/components/PageLayout.astro";
---

<PageLayout config={siteConfig} currentPath="/">
  <!-- page content -->
</PageLayout>
```

Same props as DocsLayout. Includes: Navbar, Footer. No sidebar or TOC.

### Content Components

#### ContentSection

Wraps a content section with an `<h2>` heading. Automatically registers in the right-side TableOfContents — no manual TOC config needed.

```astro
---
import ContentSection from "@luciodale/docs-ui-kit/components/ContentSection.astro";
---

<ContentSection label="Installation">
  <p>Install the package...</p>
</ContentSection>

<ContentSection label="Quick Start">
  <p>Create a manager...</p>
</ContentSection>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `label` | `string` | Yes | Section heading text. Also appears in the TOC. |
| `id` | `string` | No | Custom anchor ID. Auto-generated from `label` if omitted (slugified). |

Renders: `<section id="..." data-toc-label="..."><h2>...</h2><slot /></section>` with `scroll-mt-24` for smooth anchor scrolling past the sticky navbar.

#### SectionHeading

Standalone `<h2>` heading without TOC registration. Use when you want a heading that does NOT appear in the table of contents.

```astro
---
import SectionHeading from "@luciodale/docs-ui-kit/components/SectionHeading.astro";
---

<SectionHeading>My Heading</SectionHeading>
<SectionHeading class="text-xl">Smaller Heading</SectionHeading>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `class` | `string` | No | Additional CSS classes. |

#### CodeBlock

Syntax-highlighted code block with copy button. Highlighting happens at build time via Shiki (zero client JS for highlighting). Uses `vitesse-dark` theme.

```astro
---
import CodeBlock from "@luciodale/docs-ui-kit/components/CodeBlock.astro";
---

<CodeBlock code="npm install my-lib" language="bash" filename="terminal" />

<CodeBlock
  code={`const x: string = "hello";
console.log(x);`}
  language="tsx"
  filename="example.ts"
/>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `code` | `string` | Yes | The source code string. Leading/trailing whitespace is trimmed. |
| `language` | `string` | No | Shiki language ID. Default: `"tsx"`. |
| `filename` | `string` | No | Shown in the header bar. Falls back to `language`. |

#### PropsTable

Renders a styled table for documenting component props or API options.

```astro
---
import PropsTable from "@luciodale/docs-ui-kit/components/PropsTable.astro";
import type { PropsTableRow } from "@luciodale/docs-ui-kit/types/props";

const rows: PropsTableRow[] = [
  { name: "url", type: "string", required: true, description: "WebSocket server URL." },
  { name: "debug", type: "boolean", defaultValue: "false", description: "Enable debug logging." },
];
---

<PropsTable title="Manager Options" rows={rows} />
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | No | Optional heading above the table. |
| `rows` | `Array<PropsTableRow>` | Yes | Table data. See PropsTableRow type above. |

#### HeroSection

Landing page hero with title, description, install command (with copy button), and optional extra content via slot.

```astro
---
import HeroSection from "@luciodale/docs-ui-kit/components/HeroSection.astro";
---

<HeroSection
  title="my-library"
  description="A short tagline."
  installCommand="npm install my-library"
>
  <!-- Optional: extra content below the install command -->
  <div class="flex gap-4">
    <a href="/docs" class="rounded-lg bg-accent px-5 py-2.5 text-sm text-white">Get Started</a>
  </div>
</HeroSection>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | Yes | Main heading (h1). |
| `description` | `string` | Yes | Subtitle paragraph. |
| `installCommand` | `string` | Yes | Shell command. Copy button copies this string. |
| `logoSrc` | `string` | No | Logo image above the title. |
| `logoAlt` | `string` | No | Alt text for logo. |

#### Callout

Info, warning, tip, or danger admonition boxes for calling out important information.

```astro
---
import Callout from "@luciodale/docs-ui-kit/components/Callout.astro";
---

<Callout type="info">This API is stable and ready for production.</Callout>
<Callout type="warning">This feature requires React 18+.</Callout>
<Callout type="tip" title="Performance">Use ref-counted subscriptions to avoid duplicate connections.</Callout>
<Callout type="danger">Calling dispose() is irreversible.</Callout>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `type` | `"info" \| "warning" \| "tip" \| "danger"` | No | Default: `"info"`. Controls color and icon. |
| `title` | `string` | No | Heading text. Defaults: "Note", "Warning", "Tip", "Danger". |

Renders a left-bordered aside with icon, title, and slot content. Supports links (`<a>`) and inline code (`<code>`) in the body.

#### FeatureList

Highlighted feature list with colored dots and keywords. Designed for landing pages and feature summaries.

```astro
---
import FeatureList from "@luciodale/docs-ui-kit/components/FeatureList.astro";
---

<FeatureList features={[
  { highlight: "Type-safe", description: "Full TypeScript support out of the box" },
  { highlight: "Lightweight", description: "Zero runtime overhead", color: "green" },
  { highlight: "Dark theme", description: "Built for modern documentation sites" },
]} />

<!-- Or set a global color for all items -->
<FeatureList
  color="cyan"
  features={[
    { highlight: "Fast", description: "Build-time syntax highlighting via Shiki" },
    { highlight: "Searchable", description: "Full-text search powered by Pagefind" },
  ]}
/>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `features` | `Array<FeatureItem>` | Yes | List of feature items (see below). |
| `color` | `FeatureColor` | No | Default: `"accent"`. Global color for all items. Overridden by per-item `color`. |

**FeatureItem:**

| Field | Type | Required | Description |
|---|---|---|---|
| `highlight` | `string` | Yes | Colored keyword/phrase. Rendered in bold with the active color. |
| `description` | `string` | No | Text after the highlight, separated by an em dash. |
| `color` | `FeatureColor` | No | Per-item color override. |

**FeatureColor:** `"accent"` \| `"blue"` \| `"green"` \| `"purple"` \| `"yellow"` \| `"cyan"`

#### PackageInfo

Displays npm version, license, GitHub stars, and a bundlephobia link. Data is fetched at build time from the npm registry and GitHub API (3s timeout, graceful fallback).

```astro
---
import PackageInfo from "@luciodale/docs-ui-kit/components/PackageInfo.astro";
---

<PackageInfo packageName="@luciodale/react-socket" githubRepo="luciodale/react-socket" />
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `packageName` | `string` | Yes | npm package name. Used to fetch version + license from registry. |
| `githubRepo` | `string` | No | GitHub `owner/repo`. Used to fetch star count. If omitted, stars badge is hidden. |

Renders a row of styled badges: version (accent color, links to npm), license, GitHub stars (links to repo), bundlephobia link.

### Search

#### SearchModal

Full-text search powered by [Pagefind](https://pagefind.app). Renders a search trigger button (for Navbar) + a dialog modal. Includes Cmd+K / Ctrl+K keyboard shortcut.

The component is automatically included in the Navbar — no manual placement needed. It loads Pagefind dynamically at runtime from `/_pagefind/pagefind.js`.

**Consumer setup:**

After building your Astro site, run Pagefind to generate the search index:

```bash
astro build && bunx pagefind --site dist/client
```

Or for static output:

```bash
astro build && bunx pagefind --site dist
```

Add this to your `package.json` scripts:

```json
{
  "scripts": {
    "build": "astro build && bunx pagefind --site dist/client"
  }
}
```

**How it works:**
- Desktop: compact search button with "Search" label + `Cmd+K` badge, placed between nav links and GitHub icon
- Mobile: small search icon button next to the hamburger menu
- Cmd+K / Ctrl+K opens a centered modal dialog with backdrop blur
- Pagefind `sub_results` are flattened so each result links to a specific page section (anchor), not just the page
- Results show section title, parent page name, and highlighted excerpt (up to 10 results)
- Clicking a result navigates to the page + section anchor and closes the modal
- Search input is debounced (150ms)
- If Pagefind is not indexed, shows a helpful setup message

**No additional imports needed** — SearchModal is included by DocsLayout and PageLayout via the Navbar.

### SEO Component

#### SEO

Renders all meta tags, Open Graph, Twitter Cards, JSON-LD structured data, and breadcrumbs. Place in `<head>`.

```astro
---
import SEO from "@luciodale/docs-ui-kit/components/SEO.astro";
---

<head>
  <SEO
    config={siteConfig}
    title="Getting Started"
    description="How to install and configure the library."
    currentPath={Astro.url.pathname}
    type="article"
  />
</head>
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `config` | `SiteConfig` | Yes | Site configuration. Provides `siteUrl`, `author`, `ogImage`, etc. |
| `title` | `string` | Yes | Page title. On `/` it's used as-is; elsewhere formatted as `Title \| SiteName`. |
| `description` | `string` | No | Page description. Falls back to `config.description`. |
| `currentPath` | `string` | Yes | URL pathname. Used for canonical URL and breadcrumbs. |
| `type` | `"website" \| "article"` | No | Default: `"website"`. Use `"article"` for docs pages (generates TechArticle JSON-LD). |
| `publishedDate` | `string` | No | ISO date string for article:published_time. |
| `modifiedDate` | `string` | No | ISO date string for article:modified_time. |
| `noindex` | `boolean` | No | Default: `false`. Set `true` to add `noindex, nofollow`. |

**What it renders:**
- `<title>` with smart formatting
- `<meta name="description">`, `<meta name="author">`, `<meta name="robots">`
- `<link rel="canonical">` (absolute URL from `siteUrl` + `currentPath`)
- `<link rel="icon">` (if `faviconSrc` set)
- Open Graph: `og:type`, `og:url`, `og:title`, `og:description`, `og:site_name`, `og:locale`, `og:image` (with dimensions + alt)
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:site`, `twitter:creator`
- Article meta: `article:published_time`, `article:modified_time`, `article:author`
- `<meta name="theme-color" content="#000000">`, `<meta name="color-scheme" content="dark">`
- JSON-LD `WebSite` schema (on homepage) or `TechArticle` schema (on article pages)
- JSON-LD `BreadcrumbList` auto-generated from URL path segments (on non-root pages)

### Icon Components

#### GithubIcon / LinkedInIcon

SVG icon components. Used internally by Navbar and Footer, but exported for custom use.

```astro
---
import GithubIcon from "@luciodale/docs-ui-kit/components/GithubIcon.astro";
import LinkedInIcon from "@luciodale/docs-ui-kit/components/LinkedInIcon.astro";
---

<GithubIcon class="w-6 text-white" />
<LinkedInIcon class="w-6 text-white/50" />
```

| Prop | Type | Required | Description |
|---|---|---|---|
| `class` | `string` | No | CSS classes. Default: `"w-5 text-white"`. |

## Typical page structure

### Base layout (create in your project)

```astro
---
// src/layouts/Base.astro
import SEO from "@luciodale/docs-ui-kit/components/SEO.astro";
import { siteConfig } from "../config";

type Props = { title: string; description?: string; type?: "website" | "article" };

const { title, description, type = "website" } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <SEO config={siteConfig} title={title} description={description} currentPath={Astro.url.pathname} type={type} />
  </head>
  <body>
    <slot />
  </body>
</html>

<style is:global>
  @import "../styles/global.css";
</style>
```

### Docs layout wrapper (create in your project)

```astro
---
// src/layouts/DocsPage.astro
import DocsLayout from "@luciodale/docs-ui-kit/components/DocsLayout.astro";
import { siteConfig } from "../config";
import Base from "./Base.astro";

type Props = { title: string; description?: string };

const { title, description } = Astro.props;
---

<Base title={title} description={description} type="article">
  <DocsLayout config={siteConfig} currentPath={Astro.url.pathname}>
    <slot />
  </DocsLayout>
</Base>
```

### Home page

```astro
---
// src/pages/index.astro
import PageLayout from "@luciodale/docs-ui-kit/components/PageLayout.astro";
import HeroSection from "@luciodale/docs-ui-kit/components/HeroSection.astro";
import FeatureList from "@luciodale/docs-ui-kit/components/FeatureList.astro";
import { siteConfig } from "../config";
import Base from "../layouts/Base.astro";

export const prerender = true;
---

<Base title={siteConfig.title}>
  <PageLayout config={siteConfig} currentPath="/">
    <HeroSection
      title={siteConfig.title}
      description={siteConfig.description}
      installCommand={siteConfig.installCommand}
    >
      <FeatureList features={[
        { highlight: "Type-safe", description: "Full TypeScript support" },
        { highlight: "Lightweight", description: "Zero runtime dependencies", color: "green" },
        { highlight: "Fast", description: "Build-time syntax highlighting", color: "cyan" },
      ]} />
    </HeroSection>
  </PageLayout>
</Base>
```

### Docs page

```astro
---
// src/pages/docs/getting-started.astro
import CodeBlock from "@luciodale/docs-ui-kit/components/CodeBlock.astro";
import ContentSection from "@luciodale/docs-ui-kit/components/ContentSection.astro";
import DocsPage from "../../layouts/DocsPage.astro";

export const prerender = true;
---

<DocsPage title="Getting Started" description="Learn how to install and use the library.">
  <ContentSection label="Installation">
    <CodeBlock code="npm install my-library" language="bash" filename="terminal" />
  </ContentSection>

  <ContentSection label="Quick Start">
    <p class="text-white/60 mb-4">Create an instance:</p>
    <CodeBlock code={`import { MyLib } from "my-library";\nconst lib = new MyLib();`} language="tsx" filename="app.ts" />
  </ContentSection>
</DocsPage>
```

Each `ContentSection` automatically appears in the right-side table of contents. No manual TOC array needed.

### Demo page with React island

```astro
---
// src/pages/demo/basic.astro
import ContentSection from "@luciodale/docs-ui-kit/components/ContentSection.astro";
import { MyDemo } from "../../components/MyDemo"; // React component
import DocsPage from "../../layouts/DocsPage.astro";

export const prerender = true;
---

<DocsPage title="Basic Demo" description="Live interactive demo.">
  <ContentSection label="Demo">
    <MyDemo client:load />
  </ContentSection>
</DocsPage>
```

React islands require `@astrojs/react` in your Astro project. The docs-ui-kit itself has zero React dependency.

## Color palette

Defined in `theme.css` via Tailwind v4 `@theme` tokens:

| Token | Value | Usage |
|---|---|---|
| `--color-accent` | `#ef4723` | Primary accent. Links, active indicators, buttons. Tailwind: `text-accent`, `bg-accent`, `border-accent`. |
| `--color-accent-hover` | `#d63d1f` | Hover state for accent. Tailwind: `bg-accent-hover`. |
| `--color-primary` | `#42170c` | Deep brown. Available but rarely used directly. |
| `--color-secondary` | `#6b7280` | Gray. |
| `--color-surface` | `#f9fafb` | Light surface (for light-mode contexts). |
| `--color-border` | `#e5e7eb` | Light border. |
| `--color-muted` | `#848d9f` | Muted text. |

Body: `background: black`, `color: white`. All components use `white/` opacity variants for text hierarchy (`text-white/70` body text, `text-white/60` secondary, `text-white/40` labels, `text-white/30` decorative).

## Responsive behavior

| Breakpoint | Left Sidebar | Content | Right TOC | Mobile Menu |
|---|---|---|---|---|
| `< md` (mobile) | Hidden | Full width | Hidden | Hamburger → slide-in from right |
| `md` – `xl` | Visible (256px) | Flex | Hidden | N/A |
| `>= xl` | Visible (256px) | Flex | Visible (176px) | N/A |

## View Transitions compatibility

All client-side scripts (`<script>` in components) re-initialize on the `astro:after-swap` event, so everything works with Astro View Transitions out of the box.

## License

MIT
