import useFetch from './use-fetch';
import lazyImport from './lazy-import';
import { request, get, post } from './request';
import extractRes from './extract-res';
import serializeBody from './serialize-body';
import setContentType from './set-content-type';
import { TrebleFetch } from './interfaces';

export type { TrebleFetch };

const trebleFetch = {
    extractRes,
    serializeBody,
    setContentType,
    request,
    get,
    post,
    useFetch,
    lazyImport
}
export { useFetch, lazyImport };
export default trebleFetch;
