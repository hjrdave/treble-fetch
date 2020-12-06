/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";
import { useTreble } from 'treble-gsm';
import { useNonInitialMountEffect } from '../hooks';
import { TStore } from '../treble-fetch-store';

const useFetch = (url: string, options: any) => {

  //Connects to App global Store
  const [{ trebleFetchLog, trebleFetchLoaders }, Store] = useTreble() as TStore;

  const date = new Date();

  //if hold is set to true useFetch will not fire (good for preventing premature firing)
  const hold = options?.hold;

  //if option set to false useFetch will not fire on initial mount
  const initialMount = (options?.initialMount === false) ? false : true;

  //send cookies with post
  const credentials = options?.credentials || 'same-origin'

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

  //sets trebleFetchLoaders state
  const [storeLoaders, setStoreLoaders] = React.useState(trebleFetchLoaders);

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

  //set default store loader to false
  const setDefaultLoaderToFalse = (storeLoaders: {
    type: string,
    routeIndex: string,
    loading: boolean
  }[]) => {
    let loaders = storeLoaders.map((item) => {
      if (item.type === 'default') {
        return { ...item, loading: false }
      }
      return item;
    });
    return loaders;
  }

  const handleLoader = (loadingState: boolean) => {
    let cleanedStoreLoaders = storeLoaders.filter((item) => item.routeIndex !== url);
    setStoreLoaders([
      {
        type: 'new',
        routeIndex: url,
        loading: loadingState
      },
      ...setDefaultLoaderToFalse(cleanedStoreLoaders)
    ])
  }




  //returns refresh method
  const [refresh, setRefresh] = React.useState((loading: boolean) => refreshFetch);

  //fetch data
  const fetchData = async (signal: any, enableErrorHandling: boolean, method?: any) => {
    try {
      setLoading(true);

      //sets store loader to false
      if (enableErrorHandling) {
        if (options.failType === 'critical') {
          handleLoader(true);
        }
      }


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

        //sets store loader to false
        if (options.failType === 'critical') {
          handleLoader(false);
        }
        setStoreLoaders(setDefaultLoaderToFalse(storeLoaders));
        //removes default loader
        setRefresh((loading: boolean) => refreshFetch);
      }
    } catch (error) {
      if (!(error.name === "AbortError")) {
        setError(error);
        setLoading(false);
        setRefresh((loading: boolean) => refreshFetch);

        //updates trebleFetch Logger Store state
        if (enableErrorHandling) {
          Store.update('updateTrebleFetchLog', {
            errors: [
              ...trebleFetchLog.errors,
              {
                type: options.failType || 'warning',
                message: error,
                time: date.getUTCDate()
              }
            ]
          });
        }


        //sets store loader to false
        if (enableErrorHandling) {
          if (options.failType === 'critical') {
            handleLoader(false);
          }
        }

      }
    }
  };

  //updates trebleFetchLoaders
  useNonInitialMountEffect(() => {
    //console.log(storeLoaders);
    Store.update('updateTrebleFetchLoaders', setDefaultLoaderToFalse(storeLoaders));
  }, [storeLoaders]);



  //makes sure useFetch can react to state changes to options.trigger or url not on initial mount
  useNonInitialMountEffect(() => {
    //creates AbortController to cancel all subscriptions in case comp unmounts before fetch finishes
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (!hold) {
      fetchData(signal, false);
    }
    //return cleanup function when comp unmounts
    return function cleanup() {
      abortController.abort();
    };
  }, [...options?.trigger || [], url, refreshDataState]);

  //fetches data on initial mount
  React.useEffect(() => {
    if (!(initialMount === false)) {
      //creates AbortController to cancel all subscriptions in case comp unmounts before fetch finishes
      const abortController = new AbortController();
      const signal = abortController.signal;

      if (!hold) {
        fetchData(signal, true);
      }
      //return cleanup function when comp unmounts
      return function cleanup() {
        //updates trebleFetch Logger Store state
        Store.update('updateTrebleFetchLog', {
          errors: []
        });
        //resets store loaders
        Store.update('updateTrebleFetchLoaders', [{
          type: 'default',
          routeIndex: 'default',
          loading: true
        }]);
        abortController.abort();
      };
    }
  }, []);

  return {
    response,
    error,
    loading,
    refresh,
    resolve,
    //post
  };
};

export default useFetch;
