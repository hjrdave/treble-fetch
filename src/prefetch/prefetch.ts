import {updateGlobalCache} from '../global-cache';

const prefetch = async (url: string) => {
    try {
      const res = await fetch(url);
      const json = await res.json();
      updateGlobalCache(url, json);
      console.log(json);
    } catch (error) {
      throw error;
    }
  };

export default prefetch;