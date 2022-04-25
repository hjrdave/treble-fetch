import serializeBody from './serialize-body';
import { TrebleFetch } from '../interfaces';

interface Params {
    baseUrl?: string | Request;
    requestUrl?: string | Request;
    body?: any;
    method?: string;
    abortController: AbortController;
    headers?: HeadersInit;
    timeout: number | boolean;
    onTimeout?: () => void;
    disableBodySerialize?: boolean;
    options?: TrebleFetch.RequestOptions;
}
const fetchRequest = async ({ baseUrl, requestUrl, body, method, headers, timeout, abortController, onTimeout, disableBodySerialize, options }: Params) => {

    //starts timeout timer
    // const requestTimer = setTimeout(() => {
    //     if (typeof timeout === 'number') {
    //         abortController.abort();
    //         if (onTimeout) {
    //             onTimeout();
    //         }
    //     }
    // }, (typeof timeout === 'number') ? timeout : 0);

    //fetch data from API
    const data = fetch(`${baseUrl}${(requestUrl) ? requestUrl : ''}`, {
        ...options,
        signal: abortController.signal,
        method: method,
        body: serializeBody(body, disableBodySerialize),
        headers: headers
    });
    const res = await data;

    //clear timeout if fetch succeeds before max time alotted
    //clearTimeout(requestTimer);

    return res;
}

export default fetchRequest;