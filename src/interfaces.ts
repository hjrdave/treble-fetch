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
    export interface FetchOptions<R> extends JSFetchOptions {
        bodyType?: BodyType;
        timeout?: number | boolean;
        onTimeout?: () => void;
        defaultRes?: R;
        mapResDataTo?: string;
        modelResData?: (response: R) => ({
            [key: string]: any
        }[]);
        fetchOnMount?: boolean | string;
        onMount?: () => void;
        interceptor?: (url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) => Promise<any>;
    }

    export interface RequestOptions extends JSFetchOptions {
        bodyType?: BodyType;
    }

    export type BodyType = 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';
}



// method ?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | string;
// headers ?: HeadersInit | { [key: string]: any };
// body ?: BodyInit | { [key: string]: any };
// bodyType ?: BodyType;
// timeout ?: number | boolean;
// onTimeout ?: () => void;
// defaultRes ?: R;
// mapResDataTo ?: string;
// modelResData ?: (response: R) => ({
//     [key: string]: any
// }[]);
// fetchOnMount ?: boolean | string;
// onMount ?: () => void;
// cache ?: RequestCache;
// credentials ?: RequestCredentials;
// integrity ?: string;
// keepalive ?: boolean;
// mode ?: RequestMode;
// redirect ?: RequestRedirect;
// referrer ?: string;
// referrerPolicy ?: ReferrerPolicy;
// window ?: null;
// interceptor ?: (url: RequestInfo, options?: TrebleFetch.FetchOptions<R>) => Promise<Response>;