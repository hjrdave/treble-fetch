import React from 'react';
import useNonInitialEffect from '../hooks/use-non-initial-mount-effect';
import { TrebleFetch } from "../interfaces";

export default function useOptions<R = Response | undefined>(url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) {

    //initial useFetch options (when comp mounts)
    const [initOptions] = React.useState(options);

    //current useFetch options (this will change when state is updates)
    const [currentOptions, setCurrentOptions] = React.useState(options);

    //sets whether or not hook will fetch on mount (can take an optional request url)
    const [fetchOnMount, setFetchOnMount] = React.useState<boolean | string>((initOptions?.fetchOnMount) ? initOptions.fetchOnMount : false);

    //fetch method
    const [method, setMethod] = React.useState((initOptions?.method) ? initOptions?.method : 'GET');

    //fetch body
    const [body, setBody] = React.useState<BodyInit | { [key: string]: string } | undefined>(initOptions?.body);

    //fetch headers
    const [baseHeaders, setBaseHeaders] = React.useState(initOptions?.headers);

    //holds auth token
    const [token, setToken] = React.useState<string | undefined>(options?.token);

    //holds combined fetch headers and token
    const [headers, setHeaders] = React.useState((baseHeaders && token) ? { ...baseHeaders, 'Authorization': token } : (baseHeaders) ? { ...baseHeaders } : (token) ? { 'Authorization': token } : undefined);

    //max time till fetch abort
    const [fetchTimeout, setFetchTimeout] = React.useState(false);

    //generic state that triggers useEffect events
    const [triggerFetch, setTriggerFetch] = React.useState([]);

    //base url that is the root url passed into useFetch url prop
    const [baseUrl, setBaseUrl] = React.useState(url);

    //post fix url that is passed from get,post, etc methods. It is only active per instance.
    const [requestUrl, setRequestUrl] = React.useState('');

    //response state that holds fetch response and data
    const [response, setResponse] = React.useState<R>(initOptions?.defaultRes as R);

    //the response type (allows for response parsing method to be statically set)
    const [responseType, setResponseType] = React.useState<TrebleFetch.ResponseType | undefined>(options?.responseType);

    //disables body serialization just incase a custom solution is needed
    const [disableBodySerialize, setDisableBodySerialize] = React.useState(options?.disableBodySerialize);

    //tracks fetch errors
    const [error, setError] = React.useState<object | string | null>(null);

    //keeps loading state
    const [loading, setLoading] = React.useState(false);

    //allows for the canceling of fetch requests before resolve
    const [abortController, setAbortController] = React.useState<AbortController>(new AbortController());

    //shows error and fires custom function when fetch times out
    const onTimeout = () => {
        if (typeof fetchTimeout === 'number') {
            // if (initOptions?.onTimeout) {
            //     initOptions?.onTimeout();
            // };
            // console.error(`Treble Fetch: Request timed out at ${(fetchTimeout / 1000)} seconds.`);
        }
    };

    //allows for res data to be modeled
    const modelResponseData = (res: typeof response | { [key: string]: any }) => {
        try {
            if (initOptions?.modelResData && res) {
                const mapResDataTo = (initOptions?.mapResDataTo) ? initOptions?.mapResDataTo : 'mappedResult';
                const mappedData = initOptions.modelResData(res as any);
                return { ...res, ...{ [mapResDataTo]: mappedData } };
            }
            return res;
        } catch (error) {
            console.error(error);
        }
        return res;
    }

    /** Allows for useFetch options to be dynamic (Not all option props are dynamic, might change later)*/
    useNonInitialEffect(() => {
        if (options?.method) {
            setMethod(options?.method);
        }
    }, [options?.method]);

    useNonInitialEffect(() => {
        if (options?.body) {
            setBody(options.body);
        }
    }, [options?.body]);

    useNonInitialEffect(() => {
        if (options?.headers) {
            setBaseHeaders(options.headers);
        }
    }, [options?.headers]);

    useNonInitialEffect(() => {
        if (options?.headers && token) {
            setHeaders({ ...baseHeaders, 'Authorization': token });
        }
        else if (options?.headers) {
            setHeaders({ ...baseHeaders });
        }
        else if (token) {
            setHeaders({ 'Authorization': token });
        }
    }, [token, baseHeaders]);

    useNonInitialEffect(() => {
        if (options?.token) {
            setToken(options.token);
        }
    }, [options?.token]);

    useNonInitialEffect(() => {
        if (options?.responseType) {
            setResponseType(options.responseType);
        }
    }, [options?.responseType]);

    useNonInitialEffect(() => {
        if (options?.disableBodySerialize) {
            setDisableBodySerialize(options.disableBodySerialize);
        }
    }, [options?.disableBodySerialize]);

    // useNonInitialEffect(() => {
    //     if (options?.timeout !== undefined) {
    //         setFetchTimeout(options.timeout);
    //     }
    // }, [options?.timeout]);

    useNonInitialEffect(() => {
        if (url) {
            setBaseUrl(url);
        }
    }, [url]);

    // React.useEffect(() => {
    //     setCurrentOptions({
    //         ...options,
    //         method: method,
    //         body: body,
    //         headers: headers,
    //         token: token,
    //         timeout: fetchTimeout
    //     });
    // }, [method, body, headers, token, fetchTimeout]);

    return {
        method,
        setMethod,
        body,
        setBody,
        baseHeaders,
        setBaseHeaders,
        headers,
        setHeaders,
        fetchTimeout,
        setFetchTimeout,
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
        onTimeout,
        token,
        setToken,
        fetchOnMount,
        setFetchOnMount,
        initOptions,
        currentOptions,
        modelResponseData,
        responseType,
        setResponseType,
        disableBodySerialize,
        setDisableBodySerialize
    }
}