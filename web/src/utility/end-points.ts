export class EndPoint {
  static SIGN_UP = "auth/signup";
  static SIGN_IN = "auth/signin";
  static REFRESH = "auth/refresh";
  static UPDATE_USER_ROLE = "auth/update/role";
  static SHORTEN_LINK = "link/shorten/new";
  static ALL_LINKS = "links/all";
  static LINK_BY_USERID = "link/user/:id";
  static LINK_BY_ALIAS = ":alias";
  static ALL_USERS = "users/all";
  static SINGLE_USER = "user/:id";
}
