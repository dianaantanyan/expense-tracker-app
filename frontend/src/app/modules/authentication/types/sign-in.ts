export type SignInRequest = {
    email: string;
    password: string;
  };
  
  export type AuthTokenType = {
    access_token: string;
    refresh_token: string;
  };