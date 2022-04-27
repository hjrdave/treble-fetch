export declare namespace TrebleFetch {

    //Native JS Fetch options
    export interface JSFetchOptions {
        method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | string;
        headers?: Headers
        body?: BodyInit | { [key: string]: any };
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
        responseType?: ResponseType
    }

    //Async Request method options
    export interface RequestOptions extends JSFetchOptions {
        requestUrl?: string | Request;
        bodyType?: BodyType;
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
    }

    //Everything under this needs refactored
    export interface FetchOptions<R = Response> extends JSFetchOptions {
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
    }


    export interface PostOptions {
        headers?: Headers
        bodyType?: BodyType;
        responseType?: ResponseType;
    }
    // export interface GetOptions {
    //     headers?: Headers
    //     responseType?: ResponseType;
    // }

    export type ResponseType = 'json' | 'text' | 'formData' | 'blob' | 'arrayBuffer' | 'raw';
    export type BodyType = 'json' | 'text' | 'formData' | 'urlSearchParams' | 'blob' | 'arrayBuffer' | 'raw';
    export type Headers = HeadersInit | { [key: string]: any };
}
