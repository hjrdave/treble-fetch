/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";
import { useNonInitialMountEffect } from '../hooks';
import useFetchMethods from "./use-fetch-methods";
import { TrebleFetch } from "../interfaces";

export default function useFetch<R = Response>(url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) {

    const { abort, modelResponseData, startRequest, onMount, reset, fetchData, setAbortController, getRequest, postRequest, managedStateRequest, triggerFetch, response, loading, error } = useFetchMethods(url, options);

    //request methods for making async requests
    const request = {
        get: async (url: string, options: TrebleFetch.GetOptions) => getRequest(url, options),
        post: async (url: string, body?: BodyInit | { [key: string]: any }, options?: TrebleFetch.PostOptions) => postRequest(url, body, options)
    }

    //manged state method for triggering GET fetch request
    const get = (requestUrl?: string, options?: { headers: HeadersInit }) => {
        managedStateRequest({
            url: requestUrl,
            method: 'GET',
            headers: options?.headers
        });
    }

    //manged state method for triggering POST fetch request
    const post = (requestUrl?: string, body?: BodyInit | { [key: string]: any }, options?: { headers: HeadersInit }) => {
        managedStateRequest({
            url: requestUrl,
            method: 'POST',
            headers: options?.headers,
            body: body
        });
    };

    //triggers fetch request and handles aborting async requests when hook unmounts
    useNonInitialMountEffect(() => {
        try {
            const abortInstance = new AbortController();
            setAbortController(abortInstance);
            startRequest(abortInstance);
            return function cleanup() {
                abortInstance.abort();
            };
        } catch (error) {
            console.error(`Treble Fetch: ${error}`);
        }
    }, [triggerFetch]);

    //fires fetch request if fetchOnMount is set to true. (A string can be passed to set an initial request url)
    React.useEffect(() => {
        onMount();
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
