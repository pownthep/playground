import { fileExist } from './electron';
const isURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/gm;

export const isValid = async (path: string): Promise<boolean> => {
  if (isURL.test(path)) return true;
  if (await fileExist(path)) return true;
  return false;
};

export const sanitizeText = (text: string): string => {
  return text.replaceAll('"', '').replaceAll('\\', '/');
};
