export declare namespace TrebleFetch {

    export interface JSFetchOptions {
        method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | string;
        headers?: HeadersInit | { [key: string]: any };
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
        //timeout?: number | boolean;
        disableBodySerialize?: boolean;
        //onTimeout?: () => void;
        defaultRes?: R;
        mapResDataTo?: string;
        modelResData?: (response: R) => ({
            [key: string]: any
        }[]);
        fetchOnMount?: boolean | string;
        onMount?: () => void;
        //interceptor?: (url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) => Promise<any>;
        token?: string;
    }

    export interface RequestOptions {
        responseType?: ResponseType;
        headers?: HeadersInit | { [key: string]: any };
        disableBodySerialize?: boolean;
    }

    export type ResponseType = 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text' | 'raw';
}
