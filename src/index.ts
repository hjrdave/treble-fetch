import useFetch from './use-fetch';
import lazyImport from './lazy-import';
import prefetch from './prefetch';
import extractRes from './extract-res';
import serializeBody from './serialize-body';
import setContentType from './set-content-type';
import { TrebleFetch } from './interfaces';

export type { TrebleFetch };

const trebleFetch = {
    extractRes,
    serializeBody,
    setContentType
}
export default trebleFetch;
export { useFetch, lazyImport, prefetch };