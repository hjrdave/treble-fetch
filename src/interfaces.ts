export declare namespace TrebleFetch {
    export interface FetchOptions {
        method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | string;
        headers?: HeadersInit;
        body?: { [key: string]: any };
        timeout?: number | boolean;
        onTimeout?: () => void;
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
}