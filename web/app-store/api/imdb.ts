import { API_DOMAIN } from ".";
import { IMDBSearchResponse } from "../interface";

export const searchIMDB = async (
  text: string
): Promise<Array<IMDBSearchResponse>> => {
  try {
    const res = await fetch(`${API_DOMAIN}/search?text=${text}`);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getIMDBInfo = async (url: string): Promise<any> => {
  const res = await fetch(`${API_DOMAIN}/imdb?url=https://www.imdb.com${url}`);
  return await res.json();
};
