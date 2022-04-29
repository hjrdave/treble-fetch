/** 
 * Manages Auth Tokens and adds them to request headers 
 * */

import { TrebleFetch } from '../interfaces';
const createHeaders = (token?: string, headers?: TrebleFetch.Headers) => {
    //default CORS header
    //const defaultCORS = { "Access-Control-Allow-Origin": "*" }
    const authHeader = { 'Authorization': (token) ? token : '' };
    const newHeaders = (headers) ? { ...authHeader, ...headers } : { ...authHeader };
    return newHeaders;
}

export default createHeaders