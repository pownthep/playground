import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import adapter from "axios/lib/adapters/http";

declare module "axios" {
  interface AxiosRequestConfig {
    jar?: CookieJar;
  }
}

const jar = new CookieJar();
export const httpClient = wrapper(
  axios.create({
    jar,
    adapter,
  })
);
