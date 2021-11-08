import { getElectronPath } from "@pownthep/electron-sdk/lib/cjs/snapshot";
import { Platform, build } from "electron-builder";

export const currentTarget = (Platform) => {
  if (process.platform === "win32") return Platform.WINDOWS.createTarget();
  else if (process.platform === "darwin") return Platform.MAC.createTarget();
  else return Platform.LINUX.createTarget();
};

build({
  targets: currentTarget(Platform),
  config: {
    // extraResources: [`extraResources/${process.platform}/mpv`],
    electronDist: getElectronPath(),
    asar: true,
    appId: "io.comp.launcher",
    asarUnpack: [],
    productName: "Axcel Desktop",
    icon: "C:/Users/pownthep/Documents/GitHub/playground/desktop/axcel-desktop/resources/app.png",
    extraMetadata: {
      name: "Axcel Desktop",
      main: "main.js",
    },
    files: [
      {
        from: ".",
        filter: ["package.json"],
      },
      {
        from: "dist/main",
      },
    ],
    win: {
      target: [
        {
          target: "nsis",
          arch: ["x64"],
        },
      ],
    },
    mac: {
      target: ["zip"],
    },
    linux: {
      target: ["zip"],
    },
    publish: null,
  },
}).then(console.log);
