import { describe, expect, test } from "bun:test";
import { withBase } from "./base-path";

// withBase reads import.meta.env.BASE_URL which defaults to "/" in bun test.
// These tests verify behavior when BASE_URL is "/" (no base).

describe("withBase (no base / default)", () => {
	test("returns internal path unchanged", () => {
		expect(withBase("/docs/getting-started")).toBe("/docs/getting-started");
	});

	test("returns root unchanged", () => {
		expect(withBase("/")).toBe("/");
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

	test("handles path without leading slash", () => {
		const result = withBase("docs/api");
		expect(result).toBe("docs/api");
	});
});
