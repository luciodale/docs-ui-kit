import { describe, expect, test } from "bun:test";
import { buildBreadcrumbs, buildCanonicalUrl, stripBasePath } from "./seo-urls";

const SITE_URL = "https://koolcodez.com/projects/react-socket";

describe("stripBasePath", () => {
	test("strips base from full pathname", () => {
		expect(
			stripBasePath("/projects/react-socket/docs/undelivered-sync", "/projects/react-socket"),
		).toBe("/docs/undelivered-sync");
	});

	test("strips base with trailing slash", () => {
		expect(stripBasePath("/projects/react-socket/docs/api", "/projects/react-socket/")).toBe(
			"/docs/api",
		);
	});

	test("returns / for root page matching base exactly", () => {
		expect(stripBasePath("/projects/react-socket", "/projects/react-socket")).toBe("/");
	});

	test("returns / for root page with trailing slash", () => {
		expect(stripBasePath("/projects/react-socket/", "/projects/react-socket/")).toBe("/");
	});

	test("returns path unchanged when base is /", () => {
		expect(stripBasePath("/docs/getting-started", "/")).toBe("/docs/getting-started");
	});

	test("returns / when path is / and base is /", () => {
		expect(stripBasePath("/", "/")).toBe("/");
	});

	test("does not strip partial segment matches", () => {
		expect(stripBasePath("/projects/react-socket-extra/docs", "/projects/react-socket")).toBe(
			"/projects/react-socket-extra/docs",
		);
	});
});

describe("buildCanonicalUrl", () => {
	test("builds correct URL from relative path", () => {
		expect(buildCanonicalUrl("/docs/undelivered-sync", SITE_URL)).toBe(
			"https://koolcodez.com/projects/react-socket/docs/undelivered-sync",
		);
	});

	test("builds correct URL for root", () => {
		expect(buildCanonicalUrl("/", SITE_URL)).toBe("https://koolcodez.com/projects/react-socket/");
	});

	test("builds correct URL with siteUrl trailing slash", () => {
		expect(buildCanonicalUrl("/docs/api", `${SITE_URL}/`)).toBe(
			"https://koolcodez.com/projects/react-socket/docs/api",
		);
	});

	test("no path duplication with base-prefixed path (regression)", () => {
		const result = buildCanonicalUrl("/docs/undelivered-sync", SITE_URL);
		expect(result).not.toContain("react-socket/projects/react-socket");
	});

	test("handles nested paths", () => {
		expect(buildCanonicalUrl("/demo/chat-room", SITE_URL)).toBe(
			"https://koolcodez.com/projects/react-socket/demo/chat-room",
		);
	});

	test("works with no-base site (root domain)", () => {
		expect(buildCanonicalUrl("/docs/api", "https://example.com")).toBe(
			"https://example.com/docs/api",
		);
	});
});

describe("buildBreadcrumbs", () => {
	test("returns null for root path", () => {
		expect(buildBreadcrumbs("/", SITE_URL)).toBeNull();
	});

	test("builds correct items for docs page", () => {
		const items = buildBreadcrumbs("/docs/undelivered-sync", SITE_URL);
		expect(items).toHaveLength(2);
		expect(items?.[0]).toEqual({
			"@type": "ListItem",
			position: 1,
			name: "Docs",
			item: "https://koolcodez.com/projects/react-socket/docs",
		});
		expect(items?.[1]).toEqual({
			"@type": "ListItem",
			position: 2,
			name: "Undelivered Sync",
			item: "https://koolcodez.com/projects/react-socket/docs/undelivered-sync",
		});
	});

	test("does not include base path segments in breadcrumbs", () => {
		const items = buildBreadcrumbs("/docs/api", SITE_URL);
		expect(items).toHaveLength(2);
		expect(items?.[0].name).toBe("Docs");
		expect(items?.[1].name).toBe("Api");
	});

	test("no path duplication in breadcrumb URLs (regression)", () => {
		const items = buildBreadcrumbs("/docs/undelivered-sync", SITE_URL);
		for (const item of items ?? []) {
			expect(item.item).not.toContain("react-socket/projects/react-socket");
		}
	});

	test("single segment path", () => {
		const items = buildBreadcrumbs("/docs", SITE_URL);
		expect(items).toHaveLength(1);
		expect(items?.[0]).toEqual({
			"@type": "ListItem",
			position: 1,
			name: "Docs",
			item: "https://koolcodez.com/projects/react-socket/docs",
		});
	});
});

describe("end-to-end: stripBasePath + buildCanonicalUrl", () => {
	const basePath = "/projects/react-socket";

	test("full pipeline produces correct canonical for docs page", () => {
		const currentPath = "/projects/react-socket/docs/undelivered-sync";
		const relative = stripBasePath(currentPath, basePath);
		const canonical = buildCanonicalUrl(relative, SITE_URL);
		expect(canonical).toBe("https://koolcodez.com/projects/react-socket/docs/undelivered-sync");
	});

	test("full pipeline produces correct canonical for root", () => {
		const currentPath = "/projects/react-socket/";
		const relative = stripBasePath(currentPath, basePath);
		const canonical = buildCanonicalUrl(relative, SITE_URL);
		expect(canonical).toBe("https://koolcodez.com/projects/react-socket/");
	});

	test("full pipeline produces correct breadcrumbs for demo page", () => {
		const currentPath = "/projects/react-socket/demo/chat-room";
		const relative = stripBasePath(currentPath, basePath);
		const items = buildBreadcrumbs(relative, SITE_URL);
		expect(items).toHaveLength(2);
		expect(items?.[0].name).toBe("Demo");
		expect(items?.[1].name).toBe("Chat Room");
		expect(items?.[1].item).toBe("https://koolcodez.com/projects/react-socket/demo/chat-room");
	});
});
