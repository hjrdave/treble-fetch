/**
 * Async Fetch Request methods
 */
import serializeBody from './fetch-helpers/serialize-body';
import { TrebleFetch } from './interfaces';
import setContentType from './fetch-helpers/set-content-type';
import extractRes from './fetch-helpers/extract-res';
import createHeaders from './fetch-helpers/create-headers';

//base fetch request used throughout library
export const baseFetchRequest = async (options: TrebleFetch.BaseRequestOptions) => {
    try {
        //fetch data from API
        const { baseUrl, requestUrl, body, signal, headers, bodyType, method, responseType, ..._options } = options;
        const url = `${baseUrl || ''}${requestUrl || ''}`;
        const data = fetch(url, {
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
        };
        const data = baseFetchRequest(requstOptions);
        const res = await data;
        const extractedRes = (res) ? extractRes(res, options.responseType) : res;
        return extractedRes;
    } catch (error) {
        console.error(`Treble Fetch: ${error}`);
    }
};

//Async POST request method
export const post = async (url: string, body: TrebleFetch.Body, options: TrebleFetch.PostOptions) => {
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