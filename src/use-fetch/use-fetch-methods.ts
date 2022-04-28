import useFetchOptions from "./use-fetch-options";
import extractRes from "../extract-res";
import { get, post, baseFetchRequest } from '../request';
import { TrebleFetch } from "../interfaces";

export default function useFetchMethods<R = Response | undefined>(url: RequestInfo, options?: TrebleFetch.UseFetchOptions<R>) {

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
        bodyType,
        fetchOnMount,
        responseType
    } = useFetchOptions(url, options);

    const fallBackBody = { msg: 'Treble Fetch: Fallback for when a body is left off of a POST request' };

    //method to manually abort a fetch request
    const abort = () => abortController.abort();

    //allows for res data to be modeled
    const modelResponseData = (res: Response | { [key: string]: any }) => {
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

    //starts fetch request and handles hook state
    const startRequest = async (abortController: AbortController) => {
        try {
            setLoading(true);
            setError(null);
            const baseFetchOptions = {
                ...initOptions,
                baseUrl: baseUrl,
                requestUrl: requestUrl,
                method: method,
                abortController: abortController,
                body: body
            }
            const res = await baseFetchRequest(baseFetchOptions);
            const extractedRes: unknown = (res) ? extractRes(res, responseType) : res;
            if (res?.ok) {
                setResponse(extractedRes as R);
                setLoading(false);
            }
            else if (res?.ok === false) {
                setLoading(false);
                if (res?.statusText.length > 0) {
                    setError(`Treble Fetch: ${res?.statusText}`);
                } else {
                    setError(`Treble Fetch: Server returned status ${res?.status}`);
                }
            };
        }
        catch (error: any) {
            setError(error);
            setLoading(false);
            console.error(`Treble Fetch: ${error}`);
        }
    }

    //handles logic that fires on mount
    const onMount = () => {
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
    }

    //resets useFetch options to original state
    const reset = (setRouteTo?: string) => {
        try {
            abort();
            setMethod((initOptions?.method) ? initOptions?.method : 'GET');
            setBaseUrl(url)
            setRequestUrl((setRouteTo) ? setRouteTo : '');
            setHeaders(initOptions?.headers);
            setBody(initOptions?.body);
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

    //async get method
    const getRequest = (url: string, options: TrebleFetch.GetOptions) => {
        const { body: initBody, ...hookOptions } = initOptions;
        const requestOptions = {
            ...hookOptions,
            ...options,
            requestUrl: `${baseUrl}${url}`,
            token: (options?.token) ? options?.token : token,
            headers: (options?.headers) ? { ...headers, ...options.headers } : headers,
            responseType: (options?.responseType) ? options.responseType : responseType
        }
        return get(url, requestOptions);
    }

    //async post method
    const postRequest = (url: string, body?: TrebleFetch.Body, options?: TrebleFetch.PostOptions) => {
        const requestBody = (body) ? body : fallBackBody;
        const { body: initBody, ...hookOptions } = initOptions;
        const requestOptions = {
            ...hookOptions,
            ...options,
            requestUrl: `${baseUrl}${url}`,
            token: (options?.token) ? options?.token : token,
            headers: (options?.headers) ? { ...headers, ...options.headers } : headers,
            responseType: (options?.responseType) ? options.responseType : responseType,
            bodyType: (options?.bodyType) ? options.bodyType : bodyType
        }
        return post(url, requestBody, requestOptions);
    }

    //method for triggering managed state fetch request
    const managedStateRequest = (options: { url?: string, method: 'GET' | 'POST', headers?: TrebleFetch.Headers, body?: TrebleFetch.Body }) => {
        try {
            abort();
            setMethod(options?.method);
            setRequestUrl((options.url) ? options.url : '');
            setBody((options?.body) ? options?.body : initOptions?.body);
            if (options?.headers) {
                setHeaders(options?.headers);
            };
            fetchData({ disableReset: true });
        } catch (error) {
            console.error(`Treble Fetch: ${error}`);
        }
    }

    return {
        abort,
        modelResponseData,
        startRequest,
        onMount,
        reset,
        fetchData,
        setAbortController,
        getRequest,
        postRequest,
        managedStateRequest,
        triggerFetch,
        response,
        loading,
        error
    }
}