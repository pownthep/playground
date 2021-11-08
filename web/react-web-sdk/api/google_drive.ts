import { GOOGLE_DRIVE_API_V3, PubSubResponse } from ".";
import { Quota } from "../interface";
import PubSub from "@pownthep/pubsub/src/electron/window";

interface GoogleOAuthResponse {
  accessToken: string;
  refreshToken?: string | null;
}

export const signIn = async () => {
  try {
    const output = await PubSub.pubSub<GoogleOAuthResponse>("/main/googleoauth/sign-in", ["drive"]);
    return output;
  } catch (error) {
    throw error;
  }
};

export const getToken = async (refreshToken: string): Promise<string> => {
  try {
    const output = await PubSub.pubSub<GoogleOAuthResponse>("/main/googleoauth/get-token", {
      scopes: ["drive"],
      refreshToken,
    });
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
    const ak = await getToken(refreshToken);
    const res = await fetch(
      `${GOOGLE_DRIVE_API_V3}/files?access_token=${ak}&q=mimeType contains 'video'&fields=*&pageSize=60`
    );
    const data = await res.json();
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

export const getQuota = async (refreshToken: string): Promise<Quota> => {
  try {
    const ak = await getToken(refreshToken);
    const res = await fetch(`${GOOGLE_DRIVE_API_V3}/about?access_token=${ak}&fields=user,storageQuota`);
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const getThumbnail = (id: String, width = 160) => {
  return `https://lh3.googleusercontent.com/u/0/d/${id}=w${Math.floor(width)}`;
};
