export declare namespace TrebleFetch {

    export interface JSFetchOptions {
        method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | string;
        headers?: Headers
        body?: BodyInit | { [key: string]: any };
        cache?: RequestCache;
        credentials?: RequestCredentials;
        integrity?: string;
        keepalive?: boolean;
        mode?: RequestMode;
        redirect?: RequestRedirect;
        referrer?: string;
        referrerPolicy?: ReferrerPolicy;
        window?: null;
    }
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
        // interceptors?: {
        //     request?: (params: { url: RequestInfo, options?: TrebleFetch.FetchOptions<Response> }) => Promise<Response>;
        //     response?: (params: { response: Response }) => Promise<Response>;
        // }
    }

    export interface SendRequestOptions extends JSFetchOptions {
        baseUrl?: string | Request;
        requestUrl?: string | Request;
        body?: any;
        method?: string;
        abortController: AbortController;
        headers?: Headers;
        bodyType?: BodyType;
        responseType?: ResponseType;
    }
    export interface PostOptions {
        headers?: Headers
        bodyType?: BodyType;
        responseType?: ResponseType;
    }
    export interface GetOptions {
        headers?: Headers
        responseType?: ResponseType;
    }

    export type ResponseType = 'json' | 'text' | 'formData' | 'blob' | 'arrayBuffer' | 'raw';
    export type BodyType = 'json' | 'text' | 'formData' | 'urlSearchParams' | 'blob' | 'arrayBuffer' | 'raw';
    export type Headers = HeadersInit | { [key: string]: any };
}
