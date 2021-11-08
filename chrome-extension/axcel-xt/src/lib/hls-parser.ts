import { MediaSources } from "./popup";

export const hls_parser = (textContent: string, data: MediaSources) => {
  const renditions = textContent.split("#EXT-X-STREAM-INF:").slice(1);
  const sources = renditions.reduce<any>((prev, rendition) => {
    const [infoText, url] = rendition.split("\n");
    const finalUrl = Object.keys(data).find((link) => link.includes(url));
    if (finalUrl) {
      const info = infoText.split(",").map((metadata) => {
        const [name, value] = metadata.split("=");
        return { [name]: value };
      });
      prev.push({
        url: finalUrl,
        ...info.reduce((prev, curr) => ({ ...prev, ...curr }), {}),
      });
    }
    return prev;
  }, []);
  return sources;
};

export const isMasterPlaylist = (textContent: string) => textContent.includes("#EXT-X-STREAM-INF:");
