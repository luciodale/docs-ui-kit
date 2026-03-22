import { describe, expect, test } from "bun:test";
import { matchPath } from "./match-path";

describe("matchPath", () => {
	test("matches exact path", () => {
		expect(matchPath("/docs/getting-started", "/docs/getting-started")).toBe(true);
	});

	test("matches trailing segments against base-prefixed current path", () => {
		expect(matchPath("/projects/react-socket/docs/getting-started", "/docs/getting-started")).toBe(
			true,
		);
	});

	test("matches single segment", () => {
		expect(matchPath("/projects/react-socket/docs", "/docs")).toBe(true);
	});

	test("does not match unrelated path", () => {
		expect(matchPath("/docs/getting-started", "/demo/chat-room")).toBe(false);
	});

	test("does not match partial segment", () => {
		expect(matchPath("/docs/getting-started-advanced", "/getting-started")).toBe(false);
	});

	test("does not match when link has more segments than current", () => {
		expect(matchPath("/docs", "/docs/getting-started")).toBe(false);
	});

	test("empty link matches empty current", () => {
		expect(matchPath("/", "/")).toBe(true);
	});

	test("empty link (root) does not match non-empty current", () => {
		expect(matchPath("/docs/api", "/")).toBe(false);
	});

	test("handles trailing slashes", () => {
		expect(matchPath("/projects/react-socket/docs/api/", "/docs/api")).toBe(true);
	});

	test("handles trailing slashes on link", () => {
		expect(matchPath("/projects/react-socket/docs/api", "/docs/api/")).toBe(true);
	});

	test("matches demo pages", () => {
		expect(matchPath("/projects/react-socket/demo/fire-and-forget", "/demo/fire-and-forget")).toBe(
			true,
		);
	});

	test("does not match different leaf segment", () => {
		expect(matchPath("/projects/react-socket/docs/api", "/docs/configuration")).toBe(false);
	});
});
