/*
    Fetch Hook
    useFetch hook that fetches data from api and has global state integration
*/
import React from "react";
import { useNonInitialMountEffect } from '../hooks';
import { TrebleFetch } from "../interfaces";



export default function useFetch<R = Response | undefined>(url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) {

    const processRes = (res: Response, bodyType: TrebleFetch.BodyType) => {
        const resBody = {
            ['arrayBuffer']: () => res.arrayBuffer(),
            ['blob']: () => res.blob(),
            ['formData']: () => res.formData(),
            ['json']: () => res.json(),
            ['text']: () => res.text()
        }
        return resBody[(bodyType) ? bodyType : 'json']();
    }

    const parseBody = (body: any, type?: TrebleFetch.BodyType) => {
        if (type === 'json' || type === undefined) {
            const bodyData = JSON.stringify(body)
            return bodyData;
        };
        return body;
    }

    const [method, setMethod] = React.useState((options?.method) ? options.method : 'GET');
    const [body, setBody] = React.useState<BodyInit | { [key: string]: string } | undefined>(parseBody(options?.body, options?.bodyType));
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

    const _fetch = async (params: { route?: string, body?: any, method?: string, signal?: AbortSignal | null, bodyType?: TrebleFetch.BodyType }) => {
        const data = fetch(`${mainURL}${(params.route) ? params.route : ''}`, {
            ...options,
            signal: params?.signal,
            method: params?.method,
            body: (params?.bodyType === 'json' || params?.bodyType === undefined) ? JSON.stringify(params?.body) : params?.body,
            headers: headers
        });
        const res = await data;
        return res;
    }

    const request = {
        get: async (route?: string, options?: { bodyType: TrebleFetch.BodyType }) => {
            const res = await _fetch({ route: route, method: 'GET' });
            const processedRes = await processRes(res, (options?.bodyType) ? options.bodyType : 'json');
            return processedRes;
        },
        post: async (route?: string, body?: any, options?: { bodyType: TrebleFetch.BodyType }) => {
            const res = await _fetch({ route: route, method: 'POST', body: body });
            const processedRes = await processRes(res, (options?.bodyType) ? options.bodyType : 'json');
            return processedRes;
        }
    }

    const reset = (setRouteTo?: string) => {
        abort();
        setMethod((options?.method) ? options?.method : 'GET');
        setRouteURL((setRouteTo) ? setRouteTo : '');
        setBody(parseBody(options?.body, options?.bodyType));
    };

    const fetchData = () => {
        reset((typeof options?.fetchOnMount === 'string') ? options?.fetchOnMount : '');
        setTriggerFetch([]);
    }

    const get = (route?: string) => {
        abort();
        setMethod('GET')
        setRouteURL((route) ? route : '');
        setBody(parseBody(options?.body, options?.bodyType));
        setTriggerFetch([]);
    };
    const post = (route: string, body?: { [key: string]: any }) => {
        abort();
        setMethod('POST');
        setRouteURL(route);
        setBody(parseBody((body) ? body : options?.body, options?.bodyType));
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
            setError(null);

            const res = await _fetch({ route: routeURL, method: method, signal: signal, body: body, bodyType: options?.bodyType });
            const processedRes = await processRes(res, (options?.bodyType) ? options.bodyType : 'json');

            if (res.ok) {
                setResponse(modelResponseData(processedRes) as R);
                setLoading(false);
            } else if (res.ok === false) {
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
        setBody(parseBody(options?.body, options?.bodyType));
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
        abort,
        request
    };
};
