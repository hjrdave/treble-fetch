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

  //toggled refresh state that triggers a new fetch request
  const [refreshDataState, setRefreshDataState] = React.useState(false);

  //returned response object state
  const [response, setResponse] = React.useState({ data: [] });

  //returned loading state object (changes to true when response resolves)
  const [loading, setLoading] = React.useState((initialMount === false) ? false : true);

  //returned error object state
  const [error, setError] = React.useState(null);

  //test resolve
  const [resolve, setResolve] = React.useState<Promise<Response>>();

  //refresh method for refetching data without having to set state.
  const refreshFetch = (loading: boolean) => {
    if (loading === false || loading === undefined) {
      if (refreshDataState === true) {
        setRefreshDataState(false);
      }
      else {
        setRefreshDataState(true);
      }
    }
  };

  //returns refresh method
  const [refresh, setRefresh] = React.useState((loading: boolean) => refreshFetch);

  //fetch data
  const fetchData = async (signal: any, method?: any) => {
    try {
      setLoading(true);

      const fetchMethod = fetch(url, {
        ...options,
        signal: signal,
        method: method || options?.method,
        body: JSON.stringify(options?.body),
      });

      setResolve(fetchMethod);

      const res = await fetchMethod;
      const json = await res.json();

      if (res.ok) {
        //assigns json res
        (res as any).data = json;
        //set returned state objects
        setResponse(res as any);
        setError(null);
        setLoading(false);
        setRefresh((loading: boolean) => refreshFetch);
      }
    } catch (error) {
      if (!(error.name === "AbortError")) {
        setError(error);
        setLoading(false);
        setRefresh((loading: boolean) => refreshFetch);
      }
    }
  };

  //test post method
  //const [post, setPost] = React.useState(() => alert('foo'));

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
  }, [...options?.trigger || [], url, refreshDataState, hold]);

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
    loading,
    refresh,
    resolve
  };
};

export default useFetch;
