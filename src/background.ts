import { isSupportedGithubPrUrl, toDevinReviewUrl } from "./githubPrUrl";

async function updateActionStateForTab(tabId: number): Promise<void> {
  try {
    const tab = await chrome.tabs.get(tabId);
    const tabUrl = tab.url ?? tab.pendingUrl;

    if (tabUrl && isSupportedGithubPrUrl(tabUrl)) {
      await chrome.action.enable(tabId);
      return;
    }
  } catch {}

  await chrome.action.disable(tabId);
}

async function syncAllOpenTabs(): Promise<void> {
  const tabs = await chrome.tabs.query({});

  await Promise.all(
    tabs
      .filter((tab): tab is chrome.tabs.Tab & { id: number } => typeof tab.id === "number")
      .map((tab) => updateActionStateForTab(tab.id)),
  );
}

chrome.runtime.onInstalled.addListener(() => {
  void chrome.action.disable();
  void syncAllOpenTabs();
});

chrome.runtime.onStartup.addListener(() => {
  void chrome.action.disable();
  void syncAllOpenTabs();
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  void updateActionStateForTab(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!changeInfo.url && !tab.url && !tab.pendingUrl && changeInfo.status !== "complete") {
    return;
  }

  void updateActionStateForTab(tabId);
});

chrome.action.onClicked.addListener((tab) => {
  const tabUrl = tab.url ?? tab.pendingUrl;

  if (!tabUrl) {
    return;
  }

  const devinReviewUrl = toDevinReviewUrl(tabUrl);

  if (!devinReviewUrl) {
    return;
  }

  void chrome.tabs.create({
    url: devinReviewUrl,
    active: true,
  });
});
