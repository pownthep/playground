export * from "./child";
export * from "./worker";
export * from "./renderer";
export * from "./server";

export const Ok = (data?: any) => ({ success: true, data });
export const Fail = (data?: any) => ({ success: false, data });
