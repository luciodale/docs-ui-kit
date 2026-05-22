import { describe, expect, test } from "bun:test";
import { withBase } from "./base-path";

// withBase reads import.meta.env.BASE_URL which defaults to "/" in bun test.
// These tests verify behavior when BASE_URL is "/" (no base).

describe("withBase (no base / default)", () => {
	test("appends trailing slash to internal route path", () => {
		expect(withBase("/docs/getting-started")).toBe("/docs/getting-started/");
	});

	test("keeps trailing slash if already present", () => {
		expect(withBase("/docs/getting-started/")).toBe("/docs/getting-started/");
	});

	test("returns root unchanged", () => {
		expect(withBase("/")).toBe("/");
	});

	test("returns file path unchanged", () => {
		expect(withBase("/sitemap-index.xml")).toBe("/sitemap-index.xml");
		expect(withBase("/logo.svg")).toBe("/logo.svg");
	});

	test("places slash before hash anchor", () => {
		expect(withBase("/docs/patterns#section")).toBe("/docs/patterns/#section");
	});

	test("places slash before query string", () => {
		expect(withBase("/docs/api?foo=bar")).toBe("/docs/api/?foo=bar");
	});

	test("returns external http URL unchanged", () => {
		expect(withBase("https://github.com/foo")).toBe("https://github.com/foo");
	});

	test("returns external https URL unchanged", () => {
		expect(withBase("https://example.com")).toBe("https://example.com");
	});

	test("returns http URL unchanged", () => {
		expect(withBase("http://example.com/path")).toBe("http://example.com/path");
	});

	test("appends slash to path without leading slash", () => {
		expect(withBase("docs/api")).toBe("docs/api/");
	});
});
