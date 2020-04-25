/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import {useEffect, useState} from 'react';
//import {getGlobalCache, updateGlobalCache, removeGlobalCache} from '../global-cache';

interface IUseFetch{
  (
    url: string,
    options: {
      default: any,
      cacheRes?: boolean,
      trigger?: any,
      method?: 'GET'| 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'COPY' |'OPTIONS',
      mode?: "navigate" | "same-origin" | "no-cors" | "cors",
      redirect?: "follow" | "error" | "manual",
      headers?: Headers | string[][] | Record<string, string>,
      body?:string | Blob | ArrayBufferView | ArrayBuffer | FormData | URLSearchParams | ReadableStream<Uint8Array> | null,
      credentials?: "same-origin" | "omit" | "include" 
    }
  ): {
    loading: boolean,
    response: any,
    error: any
  }
}

const useFetch: IUseFetch = (url, options) => {
    //sets initial response to cached or default
    const [response, setResponse] = useState(/*getGlobalCache(url) || */options.default);
    const [cache, setCache] = useState((options?.cacheRes !== false) ? true : false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(url,{
            method: options?.method,
            mode: options?.mode,
            redirect: options?.redirect,
            headers: options?.headers,
            body: JSON.stringify(options?.body),
            credentials: options?.credentials
          });
          const json = await res.json();
          setResponse(json);
          setLoading(false);
          //puts new response data into global cache
          if(cache){
            //updateGlobalCache(url, json);
          }
          //if cacheRes option is set to false it will remove it
          else{
           // removeGlobalCache(url);
          }
        } catch (error) {
          setError(error);
        }
      };
      fetchData();
    }, [options?.trigger]);
    
    
    return {response, loading, error};
    
    
  };

export default useFetch;


