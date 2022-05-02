export declare namespace TrebleFetch {

    export type Body = BodyInit | { [key: string]: any };
    export type Headers = HeadersInit | { [key: string]: any };
    export type ResponseType = 'json' | 'text' | 'formData' | 'blob' | 'arrayBuffer' | 'raw';
    export type BodyType = 'json' | 'text' | 'formData' | 'urlSearchParams' | 'blob' | 'arrayBuffer' | 'raw';
    export type Error = string | object | null | undefined;

    //Native JS Fetch options
    export interface JSFetchOptions {
        method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | string;
        headers?: Headers
        body?: Body;
        cache?: RequestCache;
        credentials?: RequestCredentials;
        integrity?: string;
        keepalive?: boolean;
        signal?: AbortSignal | null;
        mode?: RequestMode;
        redirect?: RequestRedirect;
        referrer?: string;
        referrerPolicy?: ReferrerPolicy;
        window?: null;
    }

    //Base Async Request function options that returns Raw Response object
    export interface BaseRequestOptions extends JSFetchOptions {
        baseUrl?: string | Request;
        requestUrl?: string | Request;
        bodyType?: BodyType;
        responseType?: ResponseType;
    }

    //Async Request method options
    export interface RequestOptions extends JSFetchOptions {
        requestUrl?: string | Request;
        bodyType?: BodyType;
        responseType?: ResponseType;
        token?: string;
    }

    //Async GET method options
    export interface GetOptions {
        requestUrl?: string | Request;
        headers?: Headers
        cache?: RequestCache;
        credentials?: RequestCredentials;
        integrity?: string;
        keepalive?: boolean;
        signal?: AbortSignal | null;
        mode?: RequestMode;
        redirect?: RequestRedirect;
        referrer?: string;
        referrerPolicy?: ReferrerPolicy;
        window?: null;
        responseType?: ResponseType;
        token?: string;
    }

    //Async POST method options
    export interface PostOptions {
        requestUrl?: string | Request;
        headers?: Headers
        cache?: RequestCache;
        credentials?: RequestCredentials;
        integrity?: string;
        keepalive?: boolean;
        signal?: AbortSignal | null;
        mode?: RequestMode;
        redirect?: RequestRedirect;
        referrer?: string;
        referrerPolicy?: ReferrerPolicy;
        window?: null;
        token?: string;
        responseType?: ResponseType;
        bodyType?: BodyType;
    }

    //useFetch Hook Options
    export interface UseFetchOptions<R = Response> extends JSFetchOptions {
        responseType?: ResponseType;
        bodyType?: BodyType;
        defaultRes?: R;
        mapResDataTo?: string;
        modelResData?: (response: R) => ({
            [key: string]: any
        }[]);
        fetchOnMount?: boolean | string;
        onMount?: () => void;
        token?: string;
        retries?: number;
        retryOn?: number[];
        retryDelay?: number
    }

    //useFetch Post Method Options (managed state)
    export interface MSPostOptions {
        headers?: HeadersInit;
        bodyType?: BodyType;
    }

    //useFetch Post Method Options (managed state)
    export interface MSGetOptions {
        headers?: HeadersInit;
        responseType?: ResponseType;
    }
}

//((attempt: number, error?: object | string | null, response?: Response) => Promise<boolean>)
