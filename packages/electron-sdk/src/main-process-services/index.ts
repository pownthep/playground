import GoogleOAuthHandler from "./google";
import WindowHandler from "./window";
import { TabWindowHandler } from "./tab";

const services = {
  window: WindowHandler,
  google: GoogleOAuthHandler,
  tab: TabWindowHandler,
};

export type Service = "window" | "google" | "tab";

export class MainProcessServices {
  public static start(list: Service[]) {
    list.forEach((name) => services[name].init());
  }
}
