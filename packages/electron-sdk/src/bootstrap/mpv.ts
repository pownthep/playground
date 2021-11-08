import type { App } from "electron";
import path from "path";
import { getExtraResources } from "../util";

export default class MPV {
  public static init(app: App): void {
    const pluginDir = "/Users/powntheplaokhunthot/Documents/playground/sidecar/mpv/darwin"; // getMPVPath(app);

    // See pitfalls section for details.
    if (process.platform !== "linux") {
      process.chdir(pluginDir);
    }
    // Fix for latest Electron.
    app.commandLine.appendSwitch("no-sandbox");
    // To support a broader number of systems.
    app.commandLine.appendSwitch("ignore-gpu-blacklist");
    console.log(getPluginEntry(pluginDir));
    app.commandLine.appendSwitch("register-pepper-plugins", `${pluginDir}/mpvjs.node;${PLUGIN_MIME_TYPE}`); //getPluginEntry(pluginDir));
  }
}

/**
 * The MIME type associated with mpv.js plugin.
 */
const PLUGIN_MIME_TYPE = "application/x-mpvjs";

function containsNonASCII(str: string) {
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      return true;
    }
  }
  return false;
}

/**
 * Return value to be passed to `register-pepper-plugins` switch.
 *
 * @param {string} pluginDir - Plugin directory
 * @param {string} [pluginName=mpvjs.node] - Plugin name
 * @throws {Error} Resulting path contains non-ASCII characters.
 */

function getPluginEntry(pluginDir: string, pluginName: string = "mpvjs.node") {
  const fullPluginPath = path.join(pluginDir, pluginName);
  // Try relative path to workaround ASCII-only path restriction.
  let pluginPath = path.relative(process.cwd(), fullPluginPath);
  if (path.dirname(pluginPath) === ".") {
    // "./plugin" is required only on Linux.
    if (process.platform === "linux") {
      pluginPath = `.${path.sep}${pluginPath}`;
    }
  } else {
    // Relative plugin paths doesn't work reliably on Windows, see
    // <https://github.com/Kagami/mpv.js/issues/9>.
    if (process.platform === "win32") {
      pluginPath = fullPluginPath;
    }
  }
  if (containsNonASCII(pluginPath)) {
    if (containsNonASCII(fullPluginPath)) {
      throw new Error("Non-ASCII plugin path is not supported");
    } else {
      pluginPath = fullPluginPath;
    }
  }
  return `${pluginPath};${PLUGIN_MIME_TYPE}`;
}

const getMPVPath = (app: App) => {
  return path.join(getExtraResources(app), process.platform, "mpv");
};
