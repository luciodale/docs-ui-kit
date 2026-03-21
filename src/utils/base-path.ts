/**
 * Prepends the Astro base path to an internal href.
 * External URLs (http/https) are returned as-is.
 */
export function withBase(href: string): string {
	if (href.startsWith("http://") || href.startsWith("https://")) return href;
	const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
	if (!base || base === "/") return href;
	return `${base}${href.startsWith("/") ? href : `/${href}`}`;
}
