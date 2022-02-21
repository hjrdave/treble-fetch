/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";
import { useNonInitialMountEffect } from '../hooks';
import { TrebleFetch } from "../interfaces";



export default function useFetch<R = Response | undefined>(url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) {

    const [method, setMethod] = React.useState((options?.method) ? options.method : 'GET');
    const [body, setBody] = React.useState(options?.body);
    const [headers, setHeaders] = React.useState(options?.headers);
    const [fetchTimeout] = React.useState((options?.timeout !== undefined) ? options.timeout : 20000);
    const [triggerFetch, setTriggerFetch] = React.useState([]);
    const [mainURL, setMainURL] = React.useState(url);
    const [routeURL, setRouteURL] = React.useState('');
    const [response, setResponse] = React.useState<R>(options?.defaultRes as R);
    const [error, setError] = React.useState<object | string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [abortController, setAbortController] = React.useState<AbortController>(new AbortController());
    const onTimeout = () => (options?.onTimeout) ? options.onTimeout() : null;

    const reset = (setRouteTo?: string) => {
        abort();
        setMethod((options?.method) ? options?.method : 'GET');
        setRouteURL((setRouteTo) ? setRouteTo : '');
        setBody(options?.body);
    };

    const fetchData = () => {
        reset((typeof options?.fetchOnMount === 'string') ? options?.fetchOnMount : '');
        setTriggerFetch([]);
    }

    const get = (route?: string) => {
        abort();
        setMethod('GET')
        setRouteURL((route) ? route : '');
        setBody(options?.body);
        setTriggerFetch([]);
    };
    const post = (route: string, body: { [key: string]: any }) => {
        abort();
        setMethod('POST');
        setRouteURL(route);
        setBody(body);
        setTriggerFetch([]);
    };

    const abort = () => abortController.abort();

    const modelResponseData = (res: typeof response | { [key: string]: any }) => {
        if (options?.modelResData && res) {
            const mapResDataTo = (options?.mapResDataTo) ? options?.mapResDataTo : 'mappedResult';
            const mappedData = options.modelResData(res as any);
            return { ...res, ...{ [mapResDataTo]: mappedData } };
        }
        return res;
    }

    const getFetch = async (signal?: AbortSignal | null) => {

        try {
            setLoading(true);
            setResponse(options?.defaultRes as R);
            setError(null);
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
                setResponse(modelResponseData(json) as R);
                setLoading(false);
            } else if (res.ok === false) {
                console.log(res);
                setLoading(false);
                if (res?.statusText.length > 0) {
                    setError(res?.statusText);
                } else {
                    setError(`Server returned status ${res?.status}`);
                }
            }
        }
        catch (error) {
            setError(error as any);
            setLoading(false);
        }
    }

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
    }, [mainURL]);

    useNonInitialMountEffect(() => {
        setHeaders(options?.headers);
        setBody(options?.body);
    }, [options?.body, options?.headers]);

    React.useEffect(() => {
        if (options?.onMount) {
            options?.onMount();
        }
        if (options?.fetchOnMount) {
            if (typeof options?.fetchOnMount === 'string') {
                setRouteURL(options?.fetchOnMount);
            }
            fetchData();
        }
    }, []);

    return {
        response,
        error,
        loading,
        fetchData,
        get,
        post,
        abort
    };
};
