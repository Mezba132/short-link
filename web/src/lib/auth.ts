import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_ID = "userId";

export const setTokens = (
  accessToken: string,
  refreshToken: string,
  userId: string
) => {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken);
  Cookies.set(USER_ID, userId);
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const getUserId = (): string | undefined => {
  return Cookies.get(USER_ID);
};

export const removeTokens = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_ID);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
