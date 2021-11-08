import { interceptor } from "./lib/interceptor";
import { Observable } from "./lib/state";
import { renderUI } from "./lib/ui";

export interface MediaSource {
  url: string;
  label: string;
  timestamp: string;
}

export const observable = new Observable<MediaSource[]>([]);

if (!window.axcelInjected) {
  console.log("Axcel is running on: ", window.location.href);
  window.axcelInjected = true;
  if (!window.location.href.includes("youtube")) interceptor();
  renderUI();
}
