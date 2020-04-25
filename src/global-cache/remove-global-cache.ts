/*
 removes global cache key value
*/

const removeGlobalCache = (key: string) => {
    
    localStorage.removeItem(`treble-${key}`);

}

export default removeGlobalCache;