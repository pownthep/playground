import PubSub from "@pownthep/pubsub/src/electron/window";

export const publish = PubSub.publish;
export const subscribe = PubSub.subscribe;
export const pubSub = PubSub.pubSub;
export const platform = window.electron?.platform ?? "browser";
export const port = 9090;