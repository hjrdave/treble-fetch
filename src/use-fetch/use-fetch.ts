/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";
import { useNonInitialMountEffect } from '../hooks';
import { TrebleFetch } from "../interfaces";



export default function useFetch<R = Response>(url: RequestInfo, options?: TrebleFetch.FetchOptions) {

    const [method, setMethod] = React.useState((options?.method) ? options.method : 'GET');
    const [body, setBody] = React.useState(options?.body);
    const [headers, setHeaders] = React.useState(options?.headers);
    const [fetchTimeout] = React.useState((options?.timeout !== undefined) ? options.timeout : 20000);
    const [triggerResetState, setTriggerResetState] = React.useState([]);
    const [triggerFetch, setTriggerFetch] = React.useState([]);
    const [mainURL, setMainURL] = React.useState(url);
    const [routeURL, setRouteURL] = React.useState('');
    const [response, setResponse] = React.useState<R | undefined>();
    const [error, setError] = React.useState<object | string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [abortController, setAbortController] = React.useState<AbortController>(new AbortController());
    const onTimeout = () => (options?.onTimeout) ? options.onTimeout() : null;

    const get = (route?: string) => {
        setMethod('GET')
        setRouteURL((route) ? route : '');
        setTriggerFetch([]);
    };
    const post = (body: { [key: string]: any }, route?: string) => {
        setMethod('POST');
        setRouteURL((route) ? route : '');
        setBody(body);
        setTriggerFetch([]);
    };

    const abort = () => abortController.abort();
    const reset = () => setTriggerResetState([]);

    const getFetch = async (signal?: AbortSignal | null) => {

        try {
            setLoading(true);
            const jsFetch = fetch(`${mainURL}${routeURL}`, {
                ...options,
                method: method,
                signal: signal,
                body: JSON.stringify(body),
                headers: headers
            });
            let res = await jsFetch;
            const json = await res.json();

            if (res.ok) {
                setResponse(json);
                setError(null);
                setLoading(false);
            }
        }
        catch (error) {
            setError(error as any);
            setLoading(false);
        }

    }

    useNonInitialMountEffect(() => {
        abort();
        setResponse(undefined);
        setLoading(false);
        setError(null);
    }, [triggerResetState]);

    useNonInitialMountEffect(() => {
        const abortInstance = new AbortController();
        setAbortController(abortInstance);
        getFetch(abortInstance.signal);
        if (typeof fetchTimeout === 'number') {
            setTimeout(() => {
                abortInstance.abort();
                onTimeout();
            }, fetchTimeout);
        }
        return function cleanup() {
            abortInstance.abort();
        };
    }, [triggerFetch]);

    useNonInitialMountEffect(() => {
        setMainURL(mainURL);
        setHeaders(headers)
    }, [mainURL, headers]);

    return {
        response,
        error,
        loading,
        get,
        post,
        abort,
        reset
    };
};
