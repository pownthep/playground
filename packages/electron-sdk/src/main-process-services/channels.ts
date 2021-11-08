export interface Channel {
  name: string;
  description: string;
}

export const channels: Channel[] = [
  {
    name: "/main/window/minimize",
    description: "Minimize current window.",
  },
  {
    name: "/main/window/toggle-maximize",
    description: "Toggle maximize of current window.",
  },
  {
    name: "/main/window/unmaximize",
    description: "Maximize current window.",
  },
  {
    name: "/main/window/toggle-pip",
    description: "Toggle current window Picture-in-Picture mode.",
  },
  {
    name: "/main/window/set-aspect-ratio",
    description: "Set the aspect ration for current window.",
  },
  {
    name: "/main/window/show",
    description: "Show current window",
  },
  {
    name: "/main/window/hide",
    description: "Hide current window",
  },
];
