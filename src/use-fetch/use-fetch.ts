/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import {useEffect, useState, useRef} from 'react';
import IUseFetch from './interface-use-fetch';
import {getGlobalCache, updateGlobalCache, removeGlobalCache} from '../global-cache';

const useFetch: IUseFetch = (url, options) => {
    //sets initial response to cached or default=
    const isCancelled = useRef(false);
    const [response, setResponse] = useState(getGlobalCache(url) || options.default);
    const [cache, setCache] = useState((options?.cacheRes !== false) ? true : false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async (url: string) => {
      try {
        const res: any = await fetch(url,{
          method: options?.method,
          mode: options?.mode, 
          redirect: options?.redirect,
          headers: options?.headers,
          body: JSON.stringify(options?.body),
          credentials: options?.credentials
        });
        const json = await res.json();

        //makes sure component is still mounted before setting state
        if(!isCancelled.current){
          setResponse(json);
          setLoading(false);
        }
        //puts new response data into global cache
        if(cache){
          updateGlobalCache(url, json);
        }
        // //if cacheRes option is set to false it will remove it
        else{
         removeGlobalCache(url);
        }
      } catch (error) {
        if(!isCancelled.current){
          setError(error);
        }
      }
    };
    
    useEffect(() => {
      fetchData(url);
      return () => {
        isCancelled.current = true;
      };
    },[]);
    
    return {response, loading, error};
    
  };

export default useFetch;


