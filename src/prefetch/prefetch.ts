/*
  prefetch.ts
  Used to fetch data from within or without a React component.
*/

import {updateGlobalCache} from '../global-cache';

interface IPrefetch{
  (
    url: string
  ): any
}
const prefetch: IPrefetch = async (url) => {
 
    try {
      const res = await fetch(url);
      const json = await res.json();
      //updateGlobalCache(url, json);
      //console.log(json);
      return json;
    } catch (error) {
      throw error;
    }
  };

export default prefetch;