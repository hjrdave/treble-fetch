/*
 Sets global cache
*/

const updateGlobalCache = (key: string, value: any) => {
    //checks if the value is an object then stringify for storage
    let handleValue = (value: any) => {
        if(typeof value === 'object'){
            return JSON.stringify(value);
        }
        return value
    }
    localStorage.setItem(`treble-${key}`, handleValue(value));

}

export default updateGlobalCache;