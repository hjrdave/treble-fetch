/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import {useEffect, useState, useRef} from 'react';
import IUseFetch from './interface-use-fetch';
//import {getGlobalCache, updateGlobalCache, removeGlobalCache} from '../global-cache';
import {useTreble} from 'treble-gsm';

const useFetch: IUseFetch = (url, options) => {

    //sets initial comp mount state to false. (Make sure async requests are cancelled)
    const isCancelled = useRef(false);

    //TrebleFetchCache store prop
    const [{trebleFetchCache}] = useTreble();

    //sets cache option state for Local Storage caching
    const [cache] = useState((options?.cacheRes) ? true : false);

    //sets response state. Initial state will use fetchData then trebleFetchCache then default
    const [response, setResponse] = useState(
      (trebleFetchCache[url]) ? {data: trebleFetchCache[url]} :
      (options?.default) ? {data: options?.default} : {data: []}
    );

    //loading state is based off of the response data.
    const [loading, setLoading] = useState((trebleFetchCache[url]) ? false : true);

    //updating state is based off of the server response
    const [updating, setUpdating] = useState(true);

    //sets server error
    const [error, setError] = useState(null);

    //fetches api data
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
        
        //makes sure response in 200 range before setting state and cache
        if(res.ok){
          res.data = json;
          //makes sure component is still mounted before setting state
          if(!(isCancelled.current)){
             setResponse(res);
             setLoading(false);
             setUpdating(false);
             setError(res.status);
          }
          //puts new response data into local storage cache if specified
          if(cache){
            //updateGlobalCache(url, json);
          }
          //if cacheRes option is set to false it will remove it
          else{
            //removeGlobalCache(url);
          }
        }
        else{
          //makes sure component is still mounted before setting state
          if(!isCancelled.current){
            setError(res);
          }
        }

      } catch (error) {
        //makes sure comp is still mounted before setting state
        if(isCancelled.current){
          setError(error);
        }
        throw error;
      }
    };
    
    //run fetchData function on comp mount
    useEffect(() => {

      fetchData(url);

      //tracks component mount state
      return () => {
        isCancelled.current = true;
      };
      
    },[options?.trigger]);
    
    //response is the initial or fetched Data state with server response
    //response: returns cached or fetched data and server response
    //loading: returns false when response has cached or fetched data.  Used for tracking rendering only.
    //updating: returns false when data is fetched.
    //error: Returns null if no errors or error object if errors
    return {response, loading, updating, error};
    
  };

export default useFetch;


