/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";

const useFetch = (url: string, options: any) => {

  //options
  const triggerFetch = options?.trigger;

  //returned response object state
  const [response, setResponse] = React.useState({ data: [] });

  //returned loading state object (changes to true when response resolves)
  const [loading, setLoading] = React.useState(true);

  //returned error object state
  const [error, setError] = React.useState(false);

  //fetch data
  const fetchData = async (signal: any) => {
    try {
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

  React.useEffect(() => {
    //creates AbortController to cancel all subscriptions in case comp unmounts before fetch finishes
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchData(signal);

    //return cleanup function when comp unmounts
    return function cleanup() {
      abortController.abort();
    };
  }, [triggerFetch]);

  return {
    response,
    error,
    loading,
  };
};

export default useFetch;
