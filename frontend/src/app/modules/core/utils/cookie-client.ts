export const setCookie = <T>(name: string, value: T, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
  };
  
  export const getCookieFromStorage = <T>(name: string): T | null => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    if (!cookie) return null;
    try {
      const value = cookie.split('=')[1];
      return JSON.parse(decodeURIComponent(value)) as T;
    } catch {
      return null;
    }
  };
  
  export const removeCookie = (name: string) => {
    document.cookie = `${name}=; max-age=0; path=/`;
  };