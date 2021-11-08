import { app } from "electron";
import MPV from "./mpv";

export default class Bootstrapper {
  public static init() {
    MPV.init(app);
  }
}
