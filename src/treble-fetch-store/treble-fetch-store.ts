/*
    Treble Fetch Store
    Creates a store with Treble Fetch state objects, that is used by the library internally.
*/

import {createStore} from 'treble-gsm';

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
    }
]);

export default TrebleFetchStore;