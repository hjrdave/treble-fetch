/** 
 * Manages Auth Tokens and adds them to request headers 
 * */

import { TrebleFetch } from '../interfaces';
const createHeaders = (token?: string, headers?: TrebleFetch.Headers) => {
    const authHeader = { 'Authorization': token };
    const newHeaders = (headers) ? { ...authHeader, ...headers } : authHeader;
    return newHeaders;
}

export default createHeaders;