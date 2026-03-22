/**
 * Strips the Astro base path prefix from a full pathname,
 * returning the path relative to the base (e.g. "/docs/foo").
 * Returns "/" for the root page.
 */
export function stripBasePath(currentPath: string, basePath: string): string {
	const normalizedBase = basePath.replace(/\/$/, "");
	if (!normalizedBase) return currentPath;
	if (currentPath === normalizedBase) return "/";
	if (currentPath.startsWith(`${normalizedBase}/`)) {
		return currentPath.slice(normalizedBase.length) || "/";
	}
	return currentPath;
}

type BreadcrumbItem = {
	"@type": "ListItem";
	position: number;
	name: string;
	item: string;
};

/**
 * Builds canonical URL from a relative path and siteUrl.
 * The relative path should already have the base stripped via `stripBasePath`.
 */
export function buildCanonicalUrl(relativePath: string, siteUrl: string): string {
	const baseUrl = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
	return new URL(relativePath.replace(/^\//, ""), baseUrl).href;
}

/**
 * Builds JSON-LD breadcrumb items from a relative path.
 * Returns null for the root path.
 */
export function buildBreadcrumbs(relativePath: string, siteUrl: string): BreadcrumbItem[] | null {
	if (relativePath === "/") return null;
	const baseUrl = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
	const segments = relativePath.split("/").filter(Boolean);
	return segments.map((segment, i, arr) => ({
		"@type": "ListItem" as const,
		position: i + 1,
		name: segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
		item: new URL(arr.slice(0, i + 1).join("/"), baseUrl).href,
	}));
}
