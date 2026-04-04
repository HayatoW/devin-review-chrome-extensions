import { describe, expect, it } from "vite-plus/test";

import { isSupportedGithubPrUrl, toDevinReviewUrl } from "./githubPrUrl";

describe("isSupportedGithubPrUrl", () => {
  it("supports a pull request root URL", () => {
    expect(isSupportedGithubPrUrl("https://github.com/foo/bar/pull/123")).toBe(true);
  });

  it("supports a pull request root URL with a trailing slash", () => {
    expect(isSupportedGithubPrUrl("https://github.com/foo/bar/pull/123/")).toBe(true);
  });

  it("supports pull request subpages", () => {
    expect(isSupportedGithubPrUrl("https://github.com/foo/bar/pull/123/files")).toBe(true);
    expect(isSupportedGithubPrUrl("https://github.com/foo/bar/pull/123/commits")).toBe(true);
    expect(isSupportedGithubPrUrl("https://github.com/foo/bar/pull/123/checks")).toBe(true);
    expect(isSupportedGithubPrUrl("https://github.com/foo/bar/pull/123/conversation")).toBe(true);
    expect(isSupportedGithubPrUrl("https://github.com/foo/bar/pull/123/files/abc")).toBe(true);
  });

  it("supports query strings and hashes", () => {
    expect(
      isSupportedGithubPrUrl("https://github.com/foo/bar/pull/123/files?diff=split#discussion_r1"),
    ).toBe(true);
  });

  it("rejects unsupported pages and hosts", () => {
    expect(isSupportedGithubPrUrl("https://github.com/foo/bar/issues/123")).toBe(false);
    expect(isSupportedGithubPrUrl("https://example.com/foo/bar/pull/123")).toBe(false);
  });

  it("rejects invalid URLs", () => {
    expect(isSupportedGithubPrUrl("not-a-url")).toBe(false);
  });
});

describe("toDevinReviewUrl", () => {
  it("replaces only the host name", () => {
    expect(
      toDevinReviewUrl("https://github.com/foo/bar/pull/123/files?diff=split#discussion_r1"),
    ).toBe("https://devinreview.com/foo/bar/pull/123/files?diff=split#discussion_r1");
  });

  it("preserves the trailing slash when present", () => {
    expect(toDevinReviewUrl("https://github.com/foo/bar/pull/123/")).toBe(
      "https://devinreview.com/foo/bar/pull/123/",
    );
  });

  it("returns null for unsupported URLs", () => {
    expect(toDevinReviewUrl("https://github.com/foo/bar/issues/123")).toBe(null);
    expect(toDevinReviewUrl("not-a-url")).toBe(null);
  });
});
