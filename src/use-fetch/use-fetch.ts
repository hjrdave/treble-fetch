/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";

const useFetch = (url: string, options: any) => {

  //detects if mounting is the initial mount
  const isInitialMountRef = React.useRef(true);

  //if hold is set to true useFetch will not fire (good for preventing premature firing on mount)
  const hold = options?.hold;

  //returned response object state
  const [response, setResponse] = React.useState({ data: [] });

  //returned loading state object (changes to true when response resolves)
  const [loading, setLoading] = React.useState(true);

  //returned error object state
  const [error, setError] = React.useState(false);

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
        setLoading(false);
      }
    } catch (error) {
      if (!(error.name === "AbortError")) {
        setError(error);
      }
    }
  };

  //makes sure useFetch can react to state changes to options.trigger or url
  React.useEffect(() => {
    if (!isInitialMountRef.current) {
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
  }, [...options?.trigger, url]);

  //fetches data on initial mount
  React.useEffect(() => {
    //creates AbortController to cancel all subscriptions in case comp unmounts before fetch finishes
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (!hold) {
      fetchData(signal);
    }
    //makes sure initial mount is set to false after initial mounting
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
    }

    //return cleanup function when comp unmounts
    return function cleanup() {
      abortController.abort();
    };
  }, []);

  return {
    response,
    error,
    loading
  };
};

export default useFetch;
