// import WS from "@pownthep/pubsub/src/ws/client";
import { pubSub } from "@/platform/electron";
import { GoogleOAuthResponse } from "@pownthep/electron-sdk/lib/es/googleoauth";
import {
  Show,
  Episode,
  DriveInfo,
  Quota,
  IMDBSearchResponse,
  AuthenticateAPiResponse,
  AnilistInfo,
} from "../interface";

export const GOOGLE_DRIVE_API_V3 = "https://www.googleapis.com/drive/v3";
export const DATA_DOMAIN = "https://vibe-three.vercel.app";
export const JSON_URL = `${DATA_DOMAIN}/data/trimmed-desktop.json`;
export const API_DOMAIN = "http://localhost:8000";
export const DL_FOLDER_PATH = `/server/downloaded`;

export const AUTH_API = `${API_DOMAIN}/authenticate`;
export const ADD_TO_DL_API = `${API_DOMAIN}/download/add?id=`;
export const CACHE_SIZE_API = `${API_DOMAIN}/cache/size`;
export const CLEAR_CACHE_API = `${API_DOMAIN}/cache/clear`;
export const DL_PROGRESS_API = `${API_DOMAIN}/download/progress`;
export const DL_FILES_API = `${API_DOMAIN}/download/files`;
export const SHOWS_PATH = `${DATA_DOMAIN}/data/shows/`;

export const signIn = async () => {
  try {
    const output = await pubSub<GoogleOAuthResponse>("googleoauth/sign-in", ["drive"]);
    return output;
  } catch (error) {
    throw error;
  }
};

export const getToken = async (refreshToken: string): Promise<string> => {
  try {
    const output = await pubSub<GoogleOAuthResponse>("googleoauth/get-token", { scopes: ["drive"], refreshToken });
    return output.accessToken;
  } catch (error) {
    throw error;
  }
};

export const searchDrive = async (text: string, refreshToken: string): Promise<any> => {
  try {
    const ak = await getToken(refreshToken);
    const res = await fetch(
      `${GOOGLE_DRIVE_API_V3}/files?access_token=${ak}&q=fullText contains '${text}' and mimeType contains 'video'&fields=*&pageSize=1000`
    );
    const data = await res.json();
    return data.files;
  } catch (error) {
    return error;
  }
};

export const getMyDriveItem = async (refreshToken: string): Promise<any> => {
  try {
    console.time("gettting my files");
    const ak = await getToken(refreshToken);
    const res = await fetch(
      `${GOOGLE_DRIVE_API_V3}/files?access_token=${ak}&q=mimeType contains 'video'&fields=*&pageSize=60`
    );
    const data = await res.json();
    console.timeEnd("gettting my files");
    return data.files;
  } catch (error) {
    return error;
  }
};

export const copyFile = async (id: string, body = {}, refreshToken: string): Promise<any> => {
  try {
    const ak = await getToken(refreshToken);
    const res = await fetch(`${GOOGLE_DRIVE_API_V3}/files/${id}/copy?access_token=${ak}&fields=*`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export const checkFile = async (id: string, refreshToken: string): Promise<any> => {
  try {
    const ak = await getToken(refreshToken);
    const res = await fetch(`${GOOGLE_DRIVE_API_V3}/files?access_token=${ak}&q=name = '${id}.mp4'&fields=*`);
    const data = await res.json();
    return data.files;
  } catch (error) {
    throw error;
  }
};

export const getAuthLink = async (): Promise<AuthenticateAPiResponse> => {
  const res = await fetch(AUTH_API);
  return await res.json();
};

export const deleteFile = async (id: String) => {
  const res = await fetch(`${API_DOMAIN}/delete/${id}`);
  return await res.json();
};

export const getDownloadedFiles = async (): Promise<Array<string>> => {
  const res = await fetch(DL_FILES_API);
  return await res.json();
};

export const getQuota = async (refreshToken: string): Promise<Quota> => {
  try {
    const ak = await getToken(refreshToken);
    const res = await fetch(`${GOOGLE_DRIVE_API_V3}/about?access_token=${ak}&fields=user,storageQuota`);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getDrive = async (): Promise<Array<DriveInfo>> => {
  try {
    const res = await fetch(`${API_DOMAIN}/drive`);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getCatalogue = async (): Promise<Array<Show>> => {
  try {
    const res = await fetch(JSON_URL);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getShow = async (id: number | string): Promise<Show> => {
  try {
    const res = await fetch(SHOWS_PATH + id + ".json");
    const data = await res.json();
    const filtered = {
      ...data,
      episodes: data.episodes.filter((i: Episode) => i.size > 0),
    };
    return filtered;
  } catch (error) {
    throw error;
  }
};

export const getCacheSize = async (): Promise<{ size: string }> => {
  try {
    const res = await fetch(CACHE_SIZE_API);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const deleteCache = async (): Promise<{ error: boolean }> => {
  try {
    const res = await fetch(CLEAR_CACHE_API);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getThumbnail = (id: String, width = 160) => {
  return `https://lh3.googleusercontent.com/u/0/d/${id}=w${Math.floor(width)}`;
};

export const downloadFile = async (name: string, size: number, id: string): Promise<any> => {
  try {
    const res = await fetch(`${ADD_TO_DL_API + id}&name=${name}&size=${size}`);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const searchIMDB = async (text: string): Promise<Array<IMDBSearchResponse>> => {
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

export const getAnilistInfo = async (title: string): Promise<AnilistInfo> => {
  var query = `
  query ($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page (page: $page, perPage: $perPage) {
      media (id: $id, search: $search, type: ANIME) {
        id
        title {
          userPreferred
        }
        bannerImage
        description
        genres
        status
        duration
        averageScore
        episodes
        format
        type
        trailer {
          id
        }
      }
    }
  }
`;

  // Define our query variables and values that will be used in the query request
  var variables = {
    perPage: 1,
    search: title,
  };

  // Define the config we'll need for our Api request
  var url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
