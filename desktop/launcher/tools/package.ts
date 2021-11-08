import { Platform, build } from "electron-builder";

export const currentTarget = (Platform) => {
  if (process.platform === "win32") return Platform.WINDOWS.createTarget();
  else if (process.platform === "darwin") return Platform.MAC.createTarget();
  else return Platform.LINUX.createTarget();
};

build({
  targets: currentTarget(Platform),
  config: {
    // icon: "/Users/powntheplaokhunthot/Documents/playground/desktop/launcher/dist/main/icon.png",
    // extraResources: [`/Users/powntheplaokhunthot/Documents/playground/sidecar/mpv/darwin`],
    // electronDist: "/Users/powntheplaokhunthot/Documents/playground/desktop/launcher/tools/electron", // getElectronPath(),
    asar: true,
    appId: "com.pownthep.pause",
    asarUnpack: [],
    productName: "Pause",
    extraMetadata: {
      name: "Pause",
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
      target: ["default"],
    },
    linux: {
      target: ["zip"],
    },
    publish: null,
  },
}).then(console.log);
