/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";
import { useNonInitialMountEffect } from '../hooks';

interface IOptions extends RequestInit {
    timeout?: number | boolean;
    onTimeout?: () => void;
}
const useFetch = (url: string, options?: IOptions) => {

    const { method: _method, body, timeout, onTimeout, ..._options } = {
        method: 'Get',
        body: {},
        timeout: (options?.timeout !== undefined) ? options.timeout : 20000,
        onTimeout: () => null,
        ...options
    };

    const [triggerResetState, setTriggerResetState] = React.useState([]);
    const [triggerFetch, setTriggerFetch] = React.useState([]);
    const [mainURL, setMainUrl] = React.useState(url);
    const [method, setMethod] = React.useState(_method);
    const [response, setResponse] = React.useState<Response | { data: any[] }>({ data: [] });
    const [error, setError] = React.useState<object | string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [abortController, setAbortController] = React.useState<AbortController>(new AbortController());
    const get = () => setTriggerFetch([]);
    // const post = () => {
    //     setMethod('POST');
    // };
    const abort = () => abortController.abort();
    const reset = () => setTriggerResetState([]);

    const getFetch = async (signal?: AbortSignal | null) => {

        try {
            setLoading(true);
            const jsFetch = fetch(url, {
                ...options,
                method: method,
                signal: signal,
                body: JSON.stringify(options?.body)
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
        setResponse({ data: [] });
        setLoading(false);
        setError(null);
    }, [triggerResetState]);

    useNonInitialMountEffect(() => {
        const abortInstance = new AbortController();
        setAbortController(abortInstance);
        getFetch(abortInstance.signal);
        if (typeof timeout === 'number') {
            setTimeout(() => {
                abortInstance.abort();
                onTimeout();
            }, timeout);
        }
        return function cleanup() {
            abortInstance.abort();
        };
    }, [triggerFetch]);

    return {
        response,
        error,
        loading,
        get,
        abort,
        reset
    };
};

export default useFetch;
