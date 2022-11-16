import React from 'react';
import useNonInitialEffect from '../hooks/use-non-initial-mount-effect';
import setContentType from './set-content-type';
import { TrebleFetch } from "../interfaces";

export default function useOptions<R = Response | undefined>(url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) {

    //sets whether or not hook will fetch on mount (can take an optional request url)
    const [fetchOnMount, setFetchOnMount] = React.useState<boolean | string>((options?.fetchOnMount) ? options.fetchOnMount : false);

    //fetch method
    const [method, setMethod] = React.useState((options?.method) ? options?.method : 'GET');

    //fetch body
    const [body, setBody] = React.useState<BodyInit | { [key: string]: string } | undefined>(options?.body);

    //the response type (allows for response parsing method to be statically set)
    const [bodyType, setBodyType] = React.useState<TrebleFetch.BodyType>((options?.bodyType) ? options.bodyType : 'json');

    //holds auth token
    const [token, setToken] = React.useState<string | undefined>(options?.token);

    //auth headers
    const [authHeader, setAuthHeader] = React.useState((token) ? { 'Authorization': token } : { 'Authorization': '' });

    //fetch headers
    const [baseHeaders, setBaseHeaders] = React.useState((options?.headers) ? options?.headers : {});

    //holds combined fetch headers and token
    const [headers, setHeaders] = React.useState({ ...authHeader, ...baseHeaders });

    //generic state that triggers useEffect events
    const [triggerFetch, setTriggerFetch] = React.useState([]);

    //base url that is the root url passed into useFetch url prop
    const [baseUrl, setBaseUrl] = React.useState(url);

    //post fix url that is passed from get,post, etc methods. It is only active per instance.
    const [requestUrl, setRequestUrl] = React.useState('');

    //response state that holds fetch response and data
    const [response, setResponse] = React.useState<R>(options?.defaultRes as R);

    //the response type (allows for response parsing method to be statically set)
    const [responseType, setResponseType] = React.useState<TrebleFetch.ResponseType>((options?.responseType) ? options.responseType : 'json');

    //tracks fetch errors
    const [error, setError] = React.useState<object | string | null>(null);

    //keeps loading state
    const [loading, setLoading] = React.useState(false);

    //allows for the canceling of fetch requests before resolve
    const [abortController, setAbortController] = React.useState<AbortController>(new AbortController());

    //sets interceptors
    const [interceptors] = React.useState(options?.interceptors);

    //allows for res data to be modeled
    const modelResponseData = (res: typeof response | { [key: string]: any }) => {
        try {
            if (options?.modelResData && res) {
                const mapResDataTo = (options?.mapResDataTo) ? options?.mapResDataTo : 'mappedResult';
                const mappedData = options.modelResData(res as any);
                return { ...res, ...{ [mapResDataTo]: mappedData } };
            }
            return res;
        } catch (error) {
            console.error(error);
        }
        return res;
    }

    //initial useFetch options (when comp mounts)
    const [initOptions] = React.useState({
        ...options,
        fetchOnMount: fetchOnMount,
        method: method,
        body: body,
        headers: headers,
        url: baseUrl,
        bodyType: bodyType,
        responseType: responseType
    });

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
        if (options?.bodyType) {
            setBodyType(options.bodyType);
        }
    }, [options?.bodyType]);

    useNonInitialEffect(() => {
        if (url) {
            setBaseUrl(url);
        }
    }, [url]);

    useNonInitialEffect(() => {
        setAuthHeader((token) ? { 'Authorization': token } : { 'Authorization': '' });
    }, [token]);

    useNonInitialEffect(() => {
        setHeaders({ ...authHeader, ...baseHeaders });
    }, [baseHeaders, authHeader]);

    return {
        method,
        setMethod,
        body,
        setBody,
        baseHeaders,
        setBaseHeaders,
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
        token,
        setToken,
        fetchOnMount,
        setFetchOnMount,
        initOptions,
        modelResponseData,
        responseType,
        setResponseType,
        bodyType,
        setBodyType,
        interceptors
    }
}