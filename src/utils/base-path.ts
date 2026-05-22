function ensureTrailingSlash(path: string): string {
	if (!path) return path;
	const match = path.match(/^([^?#]*)([?#].*)?$/);
	if (!match) return path;
	const main = match[1] ?? "";
	const rest = match[2] ?? "";
	if (!main || main.endsWith("/")) return path;
	const lastSegment = main.split("/").pop() ?? "";
	if (lastSegment.includes(".")) return path;
	return `${main}/${rest}`;
}

/**
 * Prepends the Astro base path to an internal href and ensures a trailing
 * slash on route paths (skipped for file paths, anchors only, and external
 * URLs). Aligns hrefs with Astro's canonical trailing-slash form so Google
 * does not see redirects when following internal links.
 */
export function withBase(href: string): string {
	if (href.startsWith("http://") || href.startsWith("https://")) return href;
	const withSlash = ensureTrailingSlash(href);
	const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
	if (!base || base === "/") return withSlash;
	return `${base}${withSlash.startsWith("/") ? withSlash : `/${withSlash}`}`;
}

export { ensureTrailingSlash };
