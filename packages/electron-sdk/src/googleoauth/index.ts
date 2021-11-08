import ElectronGoogleOAuth2, {
  ElectronGoogleOAuth2Options,
} from "@getstation/electron-google-oauth2";
import { $ } from "../promise-helper";

const SCOPE_DOMAIN = "https://www.googleapis.com/auth/";

export interface GoogleOAuthResponse {
  accessToken: string;
  refreshToken?: string | null;
}

export default class GoogleOAuth {
  public static client: ElectronGoogleOAuth2;
  public static CLIENT_ID: string;
  public static CLIENT_SECRET: string;
  public static REDIRECT_URL: string;
  public static options: Partial<ElectronGoogleOAuth2Options>;

  public static init(
    clientId: string,
    secret: string,
    options: Partial<ElectronGoogleOAuth2Options>
  ) {
    this.CLIENT_ID = clientId;
    this.CLIENT_SECRET = secret;
    this.options = options;
  }

  private static createClient(scopes: string[]) {
    if (GoogleOAuth.client) return;
    GoogleOAuth.client = new ElectronGoogleOAuth2(
      this.CLIENT_ID,
      this.CLIENT_SECRET,
      getScopes(scopes),
      this.options
    );
  }

  public static async signIn(scopes: string[]): Promise<GoogleOAuthResponse> {
    GoogleOAuth.createClient(scopes);
    return GoogleOAuth.loginToken();
  }

  public static async getToken(
    scopes: string[],
    refreshToken: string
  ): Promise<GoogleOAuthResponse> {
    GoogleOAuth.createClient(scopes);
    return GoogleOAuth.refreshToken(refreshToken);
  }

  private static async refreshToken(token: string) {
    GoogleOAuth.client.setTokens({ refresh_token: token });
    const [res, err] = await $(
      GoogleOAuth.client.oauth2Client.getAccessToken()
    );
    if (res && res.token) {
      return { accessToken: res.token };
    }
    throw new Error(err);
  }

  private static async loginToken(): Promise<GoogleOAuthResponse> {
    const [token, err] = await $(
      GoogleOAuth.client.openAuthWindowAndGetTokens()
    );
    console.log(GoogleOAuth.client.oauth2Client.generateAuthUrl());
    if (token && token.access_token) {
      return {
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
      };
    }
    throw new Error(err);
  }

  public static signOut() {
    return GoogleOAuth.client.oauth2Client.revokeCredentials();
  }
}

const getScopes = (scopes: string[]) => {
  return scopes.map((scope) => `${SCOPE_DOMAIN}${scope}`);
};
