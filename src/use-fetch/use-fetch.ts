/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";
import { useNonInitialMountEffect } from '../hooks';
import useOptions from "./use-options";
// import extractData from "./extract-data";
// import fetchRequest from "./fetch-request";
import { baseFetchRequest, get as getRequest, post as postRequest } from "../request";
import { TrebleFetch } from "../interfaces";

export default function useFetch<R = Response>(url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) {

    const {
        method,
        setMethod,
        body,
        setBody,
        baseHeaders,
        setBaseHeaders,
        token,
        setToken,
        headers,
        setHeaders,
        triggerFetch,
        setTriggerFetch,
        baseUrl,
        setBaseUrl,
        requestUrl,
        setRequestUrl,
        response,
        setResponse,
        error,
        setError,
        loading,
        setLoading,
        abortController,
        setAbortController,
        initOptions,
        fetchOnMount,
        setFetchOnMount,
        modelResponseData,
        currentOptions,
        responseType
    } = useOptions(url, options);

    const fallBackBody = { msg: 'Treble Fetch: Fallback for when a body is left off of a POST request' };

    //request methods for making async requests
    const request = {
        get: async (url: string, options: TrebleFetch.GetOptions) => {
            //const { body, ...hookOptions } = initOptions;
            const hookOptions = {};
            const requestOptions = {
                ...hookOptions,
                ...options,
                requestUrl: `${baseUrl}${url}`,
                token: (options?.token) ? options?.token : token,
                headers: (options?.headers) ? { ...headers, ...options.headers } : headers,
                responseType: (options?.responseType) ? options.responseType : responseType
            }
            return getRequest(url, requestOptions);
        },
        post: async (url: string, body?: BodyInit | { [key: string]: any }, options?: TrebleFetch.PostOptions) => {
            const requestBody = (body) ? body : fallBackBody;
            //const { body, ...hookOptions } = initOptions;
            const hookOptions = {};
            const requestOptions = {
                ...hookOptions,
                ...options,
                requestUrl: `${baseUrl}${url}`,
                token: (options?.token) ? options?.token : token,
                headers: (options?.headers) ? { ...headers, ...options.headers } : headers,
                responseType: (options?.responseType) ? options.responseType : responseType,
                bodyType: (options?.bodyType) ? options.bodyType : bodyType
            }
            return postRequest(url, requestBody, requestOptions);
        }
    }

    //resets useFetch options to original state
    const reset = (setRouteTo?: string) => {
        // try {
        //     abort();
        //     setMethod((initOptions?.method) ? initOptions?.method : 'GET');
        //     setBaseUrl(url)
        //     setRequestUrl((setRouteTo) ? setRouteTo : '');
        //     setHeaders(initOptions?.headers);
        //     setBody(initOptions?.body);
        // } catch (error) {
        //     console.error(`Treble Fetch: ${error}`);
        // }
    };

    //triggers fetch request.
    const fetchData = (options?: { disableReset?: boolean }) => {
        // try {
        //     if (!options?.disableReset) {
        //         reset((typeof fetchOnMount === 'string') ? fetchOnMount : '');
        //     };
        //     setTriggerFetch([]);
        // } catch (error) {
        //     console.error(`Treble Fetch: ${error}`);
        // }
    }

    //method for triggering GET fetch request
    const get = (requestUrl?: string, options?: { headers: HeadersInit }) => {
        // try {
        //     abort();
        //     setMethod('GET')
        //     setRequestUrl((requestUrl) ? requestUrl : '');
        //     setBody(initOptions?.body);
        //     if (options?.headers) {
        //         const requestHeaders = (options?.headers && token) ? { ...options.headers, 'Authorization': token } : { ...options.headers };
        //         setHeaders(requestHeaders);
        //     }
        //     fetchData({ disableReset: true });
        // } catch (error) {
        //     console.error(`Treble Fetch: ${error}`);
        // }
    };

    //method for triggering POST fetch request
    const post = (requestUrl: string, body?: BodyInit | { [key: string]: any }, options?: { headers: HeadersInit }) => {
        // try {
        //     abort();
        //     setMethod('POST');
        //     setRequestUrl(requestUrl);
        //     setBody((body) ? body : initOptions?.body);
        //     if (options?.headers) {
        //         const requestHeaders = (options?.headers && token) ? { ...options.headers, 'Authorization': token } : { ...options.headers };
        //         setHeaders(requestHeaders);
        //     }
        //     fetchData({ disableReset: true });
        // } catch (error) {
        //     console.error(`Treble Fetch: ${error}`);
        // }
    };

    //method to manually abort a fetch request
    const abort = () => abortController.abort();

    //handles fetch request and sets state
    const sendRequest = async (abortController: AbortController) => {
        // try {
        //     setLoading(true);
        //     setError(null);
        //     const res = await fetchRequest({ baseUrl: baseUrl, requestUrl: requestUrl, method: method, abortController: abortController, timeout: fetchTimeout, onTimeout: onTimeout, body: body, disableBodySerialize: disableBodySerialize, options: initOptions });
        //     const processedRes = await extractData(res, responseType);
        //     if (res.ok) {
        //         setResponse(modelResponseData(processedRes as any) as R);
        //         setLoading(false);
        //     } else if (res.ok === false) {
        //         setLoading(false);
        //         if (res?.statusText.length > 0) {
        //             setError(`Treble Fetch: ${res?.statusText}`);
        //         } else {
        //             setError(`Treble Fetch: Server returned status ${res?.status}`);
        //         }
        //     }
        // }
        // catch (error) {
        //     setError(error as any);
        //     setLoading(false);
        //     console.error(`Treble Fetch: ${error}`);
        // }
    }

    //triggers fetch request and aborts request if component unmounts
    useNonInitialMountEffect(() => {
        // try {
        //     const abortInstance = new AbortController();
        //     setAbortController(abortInstance);
        //     sendRequest(abortInstance);
        //     return function cleanup() {
        //         abortInstance.abort();
        //     };
        // } catch (error) {
        //     console.error(`Treble Fetch: ${error}`);
        // }
    }, [triggerFetch]);

    //

    //fires fetch request if fetchOnMount is set to true. (A string can be passed to set an initial request url)
    React.useEffect(() => {
        // try {
        //     if (initOptions?.onMount) {
        //         initOptions?.onMount();
        //     }
        //     console.log(fetchOnMount)
        //     if (fetchOnMount) {

        //         if (typeof fetchOnMount === 'string') {
        //             setRequestUrl(fetchOnMount);
        //         }
        //         fetchData();
        //     }
        // } catch (error) {
        //     console.error(`Treble Fetch: ${error}`);
        // }
    }, []);

    return {
        response,
        error,
        loading,
        fetchData,
        get,
        post,
        abort,
        request
    };
};
