import { DLM } from "./lib/dlm";
import { PubSubBackground } from "@pownthep/pubsub/lib/es/chrome-extension/content";
import { getMediaHeaders } from "@pownthep/axcel-core/lib/es/headers";

const media = [
  "application/x-mpegurl",
  "application/vnd.apple.mpegurl",
  "application/dash+xml",
  "application/f4m+xml",
  "application/octet-stream-m3u8",
  "video/",
  "audio/",
];

PubSubBackground.init();

chrome.downloads.onDeterminingFilename.addListener(async (dlItem) => {
  try {
    if (dlItem.finalUrl.includes("blob:")) throw new Error();
    await chrome.downloads.cancel(dlItem.id);
    await DLM.download(dlItem.finalUrl, dlItem.filename, dlItem.fileSize, dlItem.mime);
  } catch (error) {
    console.log("Axcel Desktop is not running, will use default download instead");
  }
});

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.initiator?.includes('youtube')) return;
    // Filters
    if (!details.initiator || !details.responseHeaders || details.url.includes(".ts") || details.url.includes(".m4s"))
      return;

    const headers = getMediaHeaders(details.responseHeaders);
    if (headers["content-type"] && media.some((type) => headers["content-type"].includes(type))) {
      cacheRequest(details.tabId, details.url, headers);
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.tabs.onRemoved.addListener((tabId) => {
  const key = `${tabId}`;
  chrome.storage.local.remove(key);
});

const cacheRequest = (tabId: number, url: string, headers: any) => {
  const key = `${tabId}`;
  chrome.storage.local.get(key).then((result) => {
    chrome.storage.local.set({
      [key]: {
        ...(result[key] ?? {}),
        [url]: {
          size: headers["content-length"] ?? 0,
          name: headers["content-disposition"] ?? "",
          mimeType: headers["content-type"],
          time: new Date().getTime(),
        },
      },
    });
  });
};
