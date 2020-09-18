/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";
import { useNonInitialMountEffect } from '../hooks';

const useFetch = (url: string, options: any) => {

  //if hold is set to true useFetch will not fire (good for preventing premature firing)
  const hold = options?.hold;

  //if option set to false useFetch will not fire on initial mount
  const initialMount = (options?.initialMount === false) ? false : true;

  //returned response object state
  const [response, setResponse] = React.useState({ data: [] });

  //returned loading state object (changes to true when response resolves)
  const [loading, setLoading] = React.useState((initialMount === false) ? false : true);

  //returned error object state
  const [error, setError] = React.useState(null);

  //fetch data
  const fetchData = async (signal: any) => {
    try {
      setLoading(true);
      const res = await fetch(url, {
        ...options,
        signal: signal,
        body: JSON.stringify(options?.body),
      });
      const json = await res.json();

      if (res.ok) {
        //assigns json res
        (res as any).data = json;
        //set returned state objects
        setResponse(res as any);
        setError(null);
        setLoading(false);
      }
    } catch (error) {
      if (!(error.name === "AbortError")) {
        setError(error);
        setLoading(false);
      }
    }
  };

  //makes sure useFetch can react to state changes to options.trigger or url not on initial mount
  useNonInitialMountEffect(() => {
    //creates AbortController to cancel all subscriptions in case comp unmounts before fetch finishes
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (!hold) {
      fetchData(signal);
    }
    //return cleanup function when comp unmounts
    return function cleanup() {
      abortController.abort();
    };
  }, [...options?.trigger, url]);

  //fetches data on initial mount
  React.useEffect(() => {
    if (!(initialMount === false)) {
      //creates AbortController to cancel all subscriptions in case comp unmounts before fetch finishes
      const abortController = new AbortController();
      const signal = abortController.signal;

      if (!hold) {
        fetchData(signal);
      }
      //return cleanup function when comp unmounts
      return function cleanup() {
        abortController.abort();
      };
    }
  }, []);

  return {
    response,
    error,
    loading
  };
};

export default useFetch;
