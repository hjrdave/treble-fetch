/*
    Treble Fetch Store
    Creates a store with Treble Fetch state objects, that is used by the library internally.
*/

import { createStore, TUseTreble } from 'treble-gsm';

interface IStoreItems {
    trebleFetchRouteIndex: string[];
    trebleFetchCatch: any;
    trebleFetchLog: {
        errors: {
            type: 'critical' | string
        }[]
    };
    trebleFetchLoaders: {
        type: 'default' | string,
        routeIndex: string,
        loading: boolean
    }[]
}

const TrebleFetchStore = createStore([
    {
        action: 'updateTrebleFetchRouteIndex',
        state: {
            trebleFetchRouteIndex: []
        }
    },
    {
        action: 'updateTrebleFetchCache',
        state: {
            trebleFetchCache: {}
        }
    },
    {
        action: 'updateTrebleFetchLog',
        state: {
            trebleFetchLog: {
                errors: []
            }
        }
    },
    {
        action: 'updateTrebleFetchLoaders',
        state: {
            trebleFetchLoaders: [
                {
                    type: 'default',
                    routeIndex: 'default',
                    loading: true
                }
            ]
        },
        features: {
            keys: true
        }
    }
]);

export type TStore = TUseTreble<IStoreItems>;

export default TrebleFetchStore;