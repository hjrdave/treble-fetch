/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";
import { useNonInitialMountEffect } from '../hooks';
import useOptions from "./use-options";
import extractData from "./extract-data";
import fetchRequest from "./fetch-request";
import { TrebleFetch } from "../interfaces";

export default function useFetch<R = Response>(url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) {

    const {
        method,
        setMethod,
        body,
        setBody,
        token,
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
        modelResponseData,
        responseType,
        bodyType,
        setBodyType,
        setResponseType,
        interceptors
    } = useOptions(url, options);

    const authHeader = (token) ? { 'Authorization': token } : { 'Authorization': '' };
    const fallBackBody = { msg: 'Treble Fetch: Fallback for when a body is left off of a POST request' };

    //request methods for making async requests
    const request = {
        get: async (url?: string, options?: TrebleFetch.GetOptions) => {
            try {
                const requestHeaders = (options?.headers) ? { ...options.headers } : {};
                const combinedHeaders = { ...authHeader, ...headers, ...requestHeaders };
                const requestResponseType = (options?.responseType) ? options.responseType : responseType;
                const requestUrl = url;
                const { body, ...hookOptions } = initOptions;
                let requestInterceptorOptions: TrebleFetch.FetchOptions<Response> = {};
                const requestInterceptors = (options?.interceptors?.request) ? options.interceptors.request : interceptors?.request;

                if (requestInterceptors) {
                    const newOptions = await requestInterceptors({ url: requestUrl, options: options });
                    requestInterceptorOptions = newOptions;
                }
                //options that will be passed to fetch request
                const fetchOptions = {
                    ...hookOptions,
                    ...options,
                    method: 'GET',
                    baseUrl: baseUrl,
                    requestUrl: requestUrl,
                    headers: combinedHeaders,
                    abortController: abortController,
                    ...requestInterceptorOptions
                };
                const res = await fetchRequest(fetchOptions);
                const processedRes = await extractData(res, requestResponseType);
                return processedRes;
            } catch (error) {
                console.error(`Treble Fetch: ${error}`);
            }
        },
        post: async (url?: string, body?: BodyInit | { [key: string]: any }, options?: TrebleFetch.PostOptions) => {
            try {
                const requestResponseType = (options?.responseType) ? options.responseType : responseType;
                const requestBodyType = (options?.bodyType) ? options.bodyType : bodyType;
                const requestUrl = url;
                const requestBody = (body) ? body : fallBackBody;
                const requestHeaders = (options?.headers) ? { ...options.headers } : {};
                const combinedHeaders = { ...authHeader, ...headers, ...requestHeaders };
                let requestInterceptorOptions: TrebleFetch.FetchOptions<Response> = {};
                const requestInterceptors = (options?.interceptors?.request) ? options.interceptors.request : interceptors?.request;

                if (requestInterceptors) {
                    const newOptions = await requestInterceptors({ url: requestUrl, options: options });
                    requestInterceptorOptions = newOptions;
                }

                //options that will be passed to fetch request
                const fetchOptions = {
                    ...initOptions,
                    ...options,
                    method: 'POST',
                    baseUrl: baseUrl,
                    requestUrl: requestUrl,
                    headers: combinedHeaders,
                    body: requestBody,
                    bodyType: requestBodyType,
                    abortController: abortController,
                    ...requestInterceptorOptions
                };

                const res = await fetchRequest(fetchOptions);
                const processedRes = await extractData(res, requestResponseType);
                return processedRes;
            } catch (error) {
                console.error(`Treble Fetch: ${error}`);
            }
        }
    }

    //resets useFetch options to original state
    const reset = (setRouteTo?: string) => {
        try {
            abort();
            setMethod((initOptions?.method) ? initOptions?.method : 'GET');
            setBaseUrl(initOptions.url)
            setRequestUrl((setRouteTo) ? setRouteTo : '');
            setHeaders(initOptions?.headers);
            setBody(initOptions?.body);
            setResponseType(initOptions.responseType);
            setBodyType(initOptions.bodyType);
        } catch (error) {
            console.error(`Treble Fetch: ${error}`);
        }
    };

    //triggers fetch request.
    const fetchData = (options?: { disableReset?: boolean }) => {
        try {
            if (!options?.disableReset) {
                reset((typeof fetchOnMount === 'string') ? fetchOnMount : '');
            };
            setTriggerFetch([]);
        } catch (error) {
            console.error(`Treble Fetch: ${error}`);
        }
    }

    //method for triggering GET fetch request
    const get = (requestUrl?: string, options?: TrebleFetch.GetOptions) => {
        try {
            abort();
            setMethod('GET')
            setRequestUrl((requestUrl) ? requestUrl : '');
            setBody(initOptions?.body);
            if (options?.responseType) {
                setResponseType(options?.responseType);
            }
            if (options?.headers) {
                const requestHeaders = (options?.headers) ? { ...options.headers } : {};
                const combinedHeaders = { ...authHeader, ...headers, ...requestHeaders };
                setHeaders(combinedHeaders);
            }
            fetchData({ disableReset: true });
        } catch (error) {
            console.error(`Treble Fetch: ${error}`);
        }
    };

    //method for triggering POST fetch request
    const post = (requestUrl: string, body?: BodyInit | { [key: string]: any }, options?: TrebleFetch.PostOptions) => {
        try {
            abort();
            setMethod('POST');
            setRequestUrl(requestUrl);
            setBody((body) ? body : (initOptions?.body) ? initOptions.body : fallBackBody);
            if (options?.responseType) {
                setResponseType(options?.responseType);
            }
            if (options?.bodyType) {
                setBodyType(options.bodyType);
            }
            if (options?.headers) {
                const requestHeaders = (options?.headers) ? { ...options.headers } : {};
                const combinedHeaders = { ...authHeader, ...headers, ...requestHeaders };
                setHeaders(combinedHeaders);
            }
            fetchData({ disableReset: true });
        } catch (error) {
            console.error(`Treble Fetch: ${error}`);
        }
    };

    //method to manually abort a fetch request
    const abort = () => abortController.abort();

    //handles fetch request and sets state
    const sendRequest = async (options: TrebleFetch.SendRequestOptions) => {
        try {
            const sendRequestOptions = { responseType, ...options };
            setLoading(true);
            setError(null);
            const res = await fetchRequest(sendRequestOptions);
            const processedRes = await extractData(res, responseType);
            if (res.ok) {
                setResponse(modelResponseData(processedRes as any) as R);
                setLoading(false);
            } else if (res.ok === false) {
                setLoading(false);
                if (res?.statusText.length > 0) {
                    setError(`Treble Fetch: ${res?.statusText}`);
                } else {
                    setError(`Treble Fetch: Server returned status ${res?.status}`);
                }
            }
        }
        catch (error) {
            setError(error as any);
            setLoading(false);
            console.error(`Treble Fetch: ${error}`);
        }
    }

    //triggers fetch request and aborts request if component unmounts
    useNonInitialMountEffect(() => {
        const runRequest = async () => {
            try {
                const abortInstance = new AbortController();
                setAbortController(abortInstance);
                let requestInterceptorOptions: TrebleFetch.FetchOptions<Response> = {};
                const requestInterceptors = (options?.interceptors?.request) ? options.interceptors.request : interceptors?.request;

                if (requestInterceptors) {
                    const newOptions = await requestInterceptors({ url: requestUrl, options: options as any });
                    requestInterceptorOptions = newOptions;
                }

                const SendRequestOptions = {
                    ...initOptions,
                    baseUrl: baseUrl,
                    requestUrl: requestUrl,
                    method: method,
                    abortController: abortInstance,
                    headers: headers,
                    body: (method === 'POST' && body === undefined) ? fallBackBody : body,
                    bodyType: bodyType,
                    ...requestInterceptorOptions
                }
                sendRequest(SendRequestOptions);
                return function cleanup() {
                    abortInstance.abort();
                };
            } catch (error) {
                console.error(`Treble Fetch: ${error}`);
            }
        };

        runRequest();

    }, [triggerFetch]);

    //

    //fires fetch request if fetchOnMount is set to true. (A string can be passed to set an initial request url)
    React.useEffect(() => {
        try {
            if (initOptions?.onMount) {
                initOptions?.onMount();
            }
            if (fetchOnMount) {

                if (typeof fetchOnMount === 'string') {
                    setRequestUrl(fetchOnMount);
                }
                fetchData();
            }
        } catch (error) {
            console.error(`Treble Fetch: ${error}`);
        }
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
