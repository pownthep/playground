export interface IPCPayload {
  channel: string;
  data?: PublishPayload;
}

export interface PublishPayload {
  isSuccess: boolean;
  output?: any;
}
