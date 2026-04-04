const SUPPORTED_HOST = "github.com";

function parseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function isPullRequestPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length < 4) {
    return false;
  }

  const [owner, repo, pullSegment, pullNumber] = segments;

  if (!owner || !repo || pullSegment !== "pull") {
    return false;
  }

  return /^\d+$/.test(pullNumber);
}

function isSupportedGithubPr(parsedUrl: URL): boolean {
  return parsedUrl.hostname === SUPPORTED_HOST && isPullRequestPath(parsedUrl.pathname);
}

export function isSupportedGithubPrUrl(url: string): boolean {
  const parsedUrl = parseUrl(url);

  if (!parsedUrl) {
    return false;
  }

  return isSupportedGithubPr(parsedUrl);
}

export function toDevinReviewUrl(url: string): string | null {
  const parsedUrl = parseUrl(url);

  if (!parsedUrl || !isSupportedGithubPr(parsedUrl)) {
    return null;
  }

  parsedUrl.hostname = "devinreview.com";

  return parsedUrl.toString();
}
