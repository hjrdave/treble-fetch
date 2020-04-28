/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import {useEffect, useState} from 'react';
import IUseFetch from './interface-use-fetch';
//import {getGlobalCache, updateGlobalCache, removeGlobalCache} from '../global-cache';

const useFetch: IUseFetch = (url, options) => {
    //sets initial response to cached or default
    const [response, setResponse] = useState(/*getGlobalCache(url) || */options.default);
    //const [cache, setCache] = useState((options?.cacheRes !== false) ? true : false);
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
          // if(cache){
          //   updateGlobalCache(url, json);
          // }
          // //if cacheRes option is set to false it will remove it
          // else{
          //  removeGlobalCache(url);
          // }
        } catch (error) {
          setError(error);
        }
      };
      fetchData();
    }, [options?.trigger]);
    
    
    return {response, loading, error};
    
    
  };

export default useFetch;


