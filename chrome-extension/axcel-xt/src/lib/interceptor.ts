import { observable } from "../inject";
import { hls_parser, isMasterPlaylist } from "./hls-parser";

export const interceptor = () => {
  const media = [
    "application/x-mpegURL",
    "application/x-mpegurl",
    "application/vnd.apple.mpegurl",
    "application/dash+xml",
    "application/f4m+xml",
    "application/octet-stream-m3u8",
    "video/",
    "audio/",
  ];

  let oldXHROpen = window.XMLHttpRequest.prototype.open;

  backOffInterval(1);

  window.XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
      try {
        const contentType = this.getResponseHeader("Content-Type");
        if (contentType && media.includes(contentType) && this.responseType === "text") {
          const responseText = this.responseText;
          if (isMasterPlaylist(responseText)) {
            const playlist = hls_parser(responseText).map((data) => {
              return {
                url: data.url,
                label: `${document.title}-${data["RESOLUTION"]}`,
                timestamp: new Date().toLocaleTimeString("en-US"),
              };
            });
            observable.update((prev) => [...playlist, ...prev]);
          }
        }
      } catch (error) {}
    });
    return oldXHROpen.apply(this, arguments as any);
  };
};

const getLabel = (url: string) => {
  return new URL(url).pathname.split("/").pop() ?? document.title;
};

const backOffInterval = (seconds: number) => {
  return window.setTimeout(() => {
    const videos = Array.from(document.querySelectorAll("video"));
    if (videos.length > 0) {
      videos.forEach((el) => {
        if (el.src && !el.src.includes("blob:"))
          observable.update((prev) => [
            {
              url: el.src,
              label: `${document.title}-${getLabel(el.src)}`,
              timestamp: new Date().toLocaleTimeString("en-US"),
            },
            ...prev,
          ]);
        el.addEventListener("loadedmetadata", (ev: any) => {
          if (ev.target.src && !ev.target.src.includes("blob:")) {
            observable.update((prev) => [
              {
                url: ev.target.src,
                label: `${document.title}-${getLabel(ev.target.src)}`,
                timestamp: new Date().toLocaleTimeString("en-US"),
              },
              ...prev,
            ]);
          }
        });
      });
    } else if (seconds < 60) return backOffInterval(seconds + 1);
  }, seconds * 1000);
};
