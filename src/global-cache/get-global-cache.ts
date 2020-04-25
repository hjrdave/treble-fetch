/*
 Gets global cache
*/

const getGlobalCache = (key: string) => {
    let localStorageObject = localStorage.getItem(`treble-${key}`);
    //does some type checking and conversions because of weird local storage quirks
    let handleValue = (value: any) => {

        //makes sure boolean values are not returned as strings
        //This might cause issues down the road.  If it becomes an issue, will seek alternative
        if(value === 'true' || value === 'false'){
            return (value === 'true') ? true : (value === 'false') ? false : value
        }

        //checks to see if the localstorage string is a valid json string
        let isJsonString = (value: any) => {
            try{
                JSON.parse(value)
            } catch (e){
                return false
            }
            return true
        }
        //if string is valid it parses back to object
        if(isJsonString(value)){
            return JSON.parse(value);
        }
        return value
    }
    if(localStorageObject){
        //console.log(handleValue(localStorageObject));
        return handleValue(localStorageObject);
    }
    return false;
}

export default getGlobalCache;