let includeHeader = /((content-length)|(content-range)|(content-type)|(cookie))/gm;

export const getWebRequestHeaders = (headers: chrome.webRequest.HttpHeader[] | undefined) => {
  if (!headers) return {};
  return headers.reduce((prev, curr) => {
    prev[curr.name] = curr.value;
    return prev;
  }, {} as { [key: string]: string });
};

export const getMediaHeaders = (headers: chrome.webRequest.HttpHeader[] | undefined) => {
  if (!headers) return {};
  return headers.reduce((prev, curr) => {
    prev[curr.name.toLowerCase()] = curr.value.toLowerCase();
    return prev;
  }, {} as { [key: string]: string });
};

export const getCookies = (headers: chrome.webRequest.HttpHeader[] | undefined) => {
  if (!headers) return {};
  const cookie = headers.find((header) => header.name.toLowerCase() === "cookie");
  if (cookie) {
    return { Cookie: cookie.value } as any;
  }
  return {};
};
