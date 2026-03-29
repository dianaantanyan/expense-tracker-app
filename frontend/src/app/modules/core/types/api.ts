export type ResponseType<T> = {
    data: T | null;
    error: string | null;
  };