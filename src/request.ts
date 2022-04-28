import serializeBody from './serialize-body';
import { TrebleFetch } from './interfaces';
import setContentType from './set-content-type';
import extractRes from './extract-res';
import createHeaders from './create-headers';

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
        return res;
    }
    catch (error) {
        console.error(`Treble Fetch: ${error}`);
    }
}

//Async generic request method
export const request = async (url: string, options: TrebleFetch.RequestOptions) => {
    try {
        const headers = createHeaders(options.token, options?.headers);
        const requstOptions = {
            ...options,
            headers: headers,
            requestUrl: url
        }
        const data = baseFetchRequest(requstOptions);
        const res = await data;
        const extractedRes = (res) ? extractRes(res, options.responseType) : res;
        return extractedRes;
    } catch (error) {
        console.error(`Treble Fetch: ${error}`);
    }
};

//Async GET request method
export const get = async (url: string, options: TrebleFetch.GetOptions) => {
    try {
        const headers = createHeaders(options.token, options?.headers);
        const requstOptions = {
            ...options,
            headers: headers,
            requestUrl: url,
            method: 'GET'
        }
        const data = baseFetchRequest(requstOptions);
        const res = await data;
        const extractedRes = (res) ? extractRes(res, options.responseType) : res;
        return extractedRes;
    } catch (error) {

    }
};

//Async POST request method
export const post = async (url: string, body: BodyInit | { [key: string]: any }, options: TrebleFetch.PostOptions) => {
    try {
        const headers = createHeaders(options.token, options?.headers);
        const requstOptions = {
            ...options,
            headers: headers,
            requestUrl: url,
            method: 'POST',
            body: body
        }
        const data = baseFetchRequest(requstOptions);
        const res = await data;
        const extractedRes = (res) ? extractRes(res, options.responseType) : res;
        return extractedRes;
    } catch (error) {
        console.error(`Treble Fetch: ${error}`);
    }
};