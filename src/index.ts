import useFetch from './use-fetch';
import lazyImport from './lazy-import';
import { request, get, post } from './request';
import { TrebleFetch } from './interfaces';

export type { TrebleFetch };

const trebleFetch = {
    request,
    get,
    post,
    useFetch,
    lazyImport
}
export { useFetch, lazyImport, get, post, request };
export default trebleFetch;
