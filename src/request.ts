import serializeBody from './serialize-body';
import { TrebleFetch } from './interfaces';
import setContentType from './set-content-type';
import extractRes from './extract-res';

//base fetch request used throughout library
export const baseFetchRequest = async (options: TrebleFetch.BaseRequestOptions) => {
    try {
        //fetch data from API
        const { baseUrl, requestUrl, body, signal, headers, bodyType, method, responseType, ..._options } = options;
        const data = fetch(`${baseUrl}${(requestUrl) ? requestUrl : ''}`, {
            ..._options,
            method: method,
            signal: signal,
            headers: setContentType(headers, bodyType),
            body: (method !== 'GET') ? serializeBody(body, bodyType) as any : undefined
        });
        const res = await data;
        const extractedRes = extractRes(res, responseType);
        return extractedRes;
    }
    catch (error) {
        console.error(`Treble Fetch: ${error}`);
    }
}

//Async generic request method
export const request = (url: string, options: TrebleFetch.RequestOptions) => baseFetchRequest({ requestUrl: url, ...options });

//Async GET request method
export const get = async (url: string, options: TrebleFetch.GetOptions) => baseFetchRequest({ ...options, requestUrl: url, method: 'GET' });

//Async POST request method
export const post = async (url: string, body: BodyInit | { [key: string]: any }, options: TrebleFetch.PostOptions) => baseFetchRequest({ ...options, requestUrl: url, method: 'POST', body: body });