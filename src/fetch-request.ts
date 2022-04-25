import serializeBody from './serialize-body';
import { TrebleFetch } from './interfaces';
import setContentType from './set-content-type';

const fetchRequest = async ({ baseUrl, requestUrl, body, abortController, headers, bodyType, method, ...options }: TrebleFetch.SendRequestOptions) => {
    //fetch data from API
    const data = fetch(`${baseUrl}${(requestUrl) ? requestUrl : ''}`, {
        ...options,
        method: method,
        signal: abortController.signal,
        headers: setContentType(headers, bodyType),
        body: (method !== 'GET') ? serializeBody(body, bodyType) : undefined
    });

    const res = await data;

    return res;
}

const get = async (url: string, options: any) => fetchRequest(options);
const post = async (url: string, body: any, options: any) => fetchRequest(options);

export { get, post }
export default fetchRequest;