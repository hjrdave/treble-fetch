/*
Interface for useFetch hook
*/

export default interface IUseFetch {
  (
    url: string,
    options?: {
      default?: any;
      cacheRes?: boolean;
      trigger?: any;
      method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "COPY" | "OPTIONS";
      mode?: "navigate" | "same-origin" | "no-cors" | "cors";
      redirect?: "follow" | "error" | "manual";
      headers?: Headers | string[][] | Record<string, string>;
      body?:
      | { [key: string]: any }
      | string
      | Blob
      | ArrayBufferView
      | ArrayBuffer
      | FormData
      | URLSearchParams
      | ReadableStream<Uint8Array>
      | null;
      credentials?: "same-origin" | "omit" | "include";
    }
  ): {
    loading: boolean;
    response: any;
    error: any;
    isAuth: boolean | undefined;
    refresh: (loading: boolean) => void
  };
}
