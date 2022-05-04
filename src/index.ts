import useFetch from './use-fetch';
import lazyImport from './lazy-import';
import { request, get, post } from './request';
import TrebleFetchM from './module/module';
import useTrebleFetch from './use-treble-fetch';
import { TrebleFetch } from './interfaces';

export type { TrebleFetch };
export { useFetch, lazyImport, get, post, request, useTrebleFetch };
export default TrebleFetchM;
