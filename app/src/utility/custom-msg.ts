export class Summary {
  static SIGN_UP = 'Create a new user';
  static SIGN_IN = 'User sign in';
  static UPDATE_REFRESH = 'Update access and refresh token';
  static UPDATE_ROLE = 'Update signle user role (Only super_admin)';
  static SHORTEN_LINK = 'Shorten a URL';
  static REDIRECT_UNIQUE_ALIAS = 'Redirect to the original URL';
  static ALL_LINKS = 'Fetch all link (Only admin, super_admin)';
  static LINKS_BY_USERID = 'Fetch all link by user id';
  static ALL_USERS = 'Fetch all users (Only admin, super_admin)';
  static SINGLE_USER = 'Fetch Single user';
}

export class SuccessMsg {
  static SIGN_UP = 'Successfully created a new user';
  static SIGN_IN = 'Sign in Successfully';
  static UPDATE_ROLE = 'Successfully Update user role';
  static UPDATE_REFRESH_TOKEN = 'Generating new access and refresh tokens';
  static SHORTEN_LINK = 'Link shortened successfully.';
  static LINK_REDIRECT = 'Redirect to the original URL.';
  static FETCH_ALL_LINK = 'Successfully Fetch all link.';
  static FETCH_LINKS_BY_USERID = 'Successfully Fetch all link by user id';
  static FETCH_ALL_USERS = 'Successfully get all users';
  static FETCH_SINGLE_USER = 'Successfully get Single user';
}

export class ErrorMsg {
  static INVALID_BODY = 'Invalid request body';
  static TOKEN_REQUIRED = 'JWT token required';
  static TOKEN_EXPIRED = 'Token has expired';
  static TOKEN_INVALID = 'Invalid token';
  static UNATHORIZED_USER = 'Unathorized User';
  static TOKEN_EXPIRED_ERROR = 'TokenExpiredError';
  static JSON_WEB_TOKEN_ERROR = 'TokenExpiredError';
  static VERIFICATION_FAILED = 'JWT verification failed';
  static REFRESH_UPDATE_FAILED = 'Refresh token not update';
  static FAILED_GENERATE_TOKEN = 'Failed to generate tokens';
  static PASSWORD_MATCH_FAILED = 'Password do not match';
  static USER_NOT_FOUND = 'User Not Found';
  static USER_ALREADY_EXIST = 'User Already Exist';
  static VALIDATION_ERROR = 'ValidationError';
  static ALIAS_NOT_FOUND = 'Alias not found or expired';
  static LINK_NOT_FOUND = 'Link not found';
  static LINK_ALREADY_EXIST = 'Link already exist';
}
