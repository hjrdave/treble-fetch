import React from 'react';
import { useAppStore } from '../../_Store';
import { useInAppMessage, useLogin, useNonInitialEffect } from '..';
import { useFetch as useFetchTF, TrebleFetch } from './treble-fetch-module';

export interface IOptions<R> extends TrebleFetch.FetchOptions<R> {
    onSuccess?: (response: R) => void;
    onError?: (error: string | object | null) => void;
    onLoading?: () => void;
    onMount?: () => void;
    loadingMsg?: string | JSX.Element;
    errorMsg?: string | JSX.Element;
    profile?: 'default' | string | boolean;
}
export interface IProfileOptions<R> extends IOptions<R> {
    baseURL?: string
}
export default function useFetch<R = Response>(url?: RequestInfo, _options?: IOptions<R>) {

    const [{ ptrui_fetchProfiles: fetchProfiles }] = useAppStore();
    const message = useInAppMessage();
    const login = useLogin();
    const [bearerToken, setBearerToken] = React.useState((login.token) ? `Bearer ${login.token}` : undefined);
    const [hookOptions] = React.useState(_options);
    const [profileOptions] = React.useState<IProfileOptions<R>>((typeof hookOptions?.profile === 'string') ? fetchProfiles[hookOptions?.profile] : fetchProfiles['default']);
    const [apiURL] = React.useState(`${(profileOptions?.baseURL) ? (profileOptions?.baseURL) : ''}${(url) ? url : ''}`);

    useNonInitialEffect(() => {
        if (login.token) {
            setBearerToken("Bearer " + login.token);
        }
    }, [login.token]);

    //interceptor fetch (refresh token here)
    const { request: requestIntercept } = useFetchTF<R>('', {
        token: bearerToken,
        credentials: 'include',
        ...profileOptions,
        ...hookOptions
    });

    //makes sure token is refreshed
    const globalInterceptor = async ({ url, options }: TrebleFetch.interceptorParams) => {

        const isTokenExpired = true;
        let newOptions: TrebleFetch.SendRequestOptions = {};
        if (isTokenExpired) {
            //const res: Response = await requestIntercept.get();
            //login.setToken(res.token);
            newOptions = { ...newOptions };
            return newOptions;
        } else {
            return newOptions;
        }

    }

    const { response, loading, error, abort, post, get, fetchData, request } = useFetchTF<R>(apiURL, {
        token: bearerToken,
        credentials: 'include',
        interceptors: { request: globalInterceptor },
        ...profileOptions,
        ...hookOptions,

    });

    //onLoading and onError messages
    useNonInitialEffect(() => {
        const loadingMsg = hookOptions?.loadingMsg;
        const errorMsg = hookOptions?.errorMsg;
        if (loading && loadingMsg) {
            message.createLoading(loadingMsg);
        }
        if (error !== null && errorMsg) {
            message.createError(errorMsg, { dismiss: false })
        }
        if (!loading && error === null) {
            message.dismissAll();
        }
    }, [loading, error]);

    //error message
    useNonInitialEffect(() => {
        const msg = hookOptions?.errorMsg;
        if (loading && msg) {
            message.createError(msg)
        }
    }, [loading]);

    //onLoading logic
    useNonInitialEffect(() => {
        if (loading && hookOptions?.onLoading) {
            hookOptions?.onLoading();
        }
    }, [loading]);

    //onError logic
    useNonInitialEffect(() => {
        if (error && hookOptions?.onError) {
            hookOptions?.onError(error);
        }
    }, [error]);

    //onSuccess logic
    useNonInitialEffect(() => {
        if (response && hookOptions?.onSuccess) {
            hookOptions?.onSuccess(response);
        }
    }, [response]);

    return {
        response,
        loading,
        error,
        abort,
        post,
        get,
        fetchData,
        request
    }

}