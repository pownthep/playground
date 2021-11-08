import { Notification } from 'electron';
import log from 'electron-log';

export const notifyError = (title: string, body: string, err: any) => {
  log.error(err);
  return new Notification({
    title,
    body,
    icon: '❌'
  }).show();
};
