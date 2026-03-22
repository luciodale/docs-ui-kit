/**
 * Checks whether the trailing segments of `currentPath` match
 * all segments of `linkHref`. This allows link hrefs like
 * `/getting-started` to match `/projects/lib/getting-started`.
 */
export function matchPath(currentPath: string, linkHref: string): boolean {
	const toSegments = (p: string) => p.split("/").filter(Boolean);
	const currentSegments = toSegments(currentPath);
	const linkSegments = toSegments(linkHref);

	if (linkSegments.length === 0) return currentSegments.length === 0;
	if (linkSegments.length > currentSegments.length) return false;

	const offset = currentSegments.length - linkSegments.length;
	for (let i = 0; i < linkSegments.length; i++) {
		if (currentSegments[offset + i] !== linkSegments[i]) return false;
	}
	return true;
}
