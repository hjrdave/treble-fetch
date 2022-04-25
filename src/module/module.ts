/*
    Treble Fetch Module
*/

import { createModule } from 'treble-gsm';

const TrebleFetch = createModule({

    name: 'treble-persist',
    namespace: 'tf',
    extendStore: {
        data: [{
            action: 'tf_updateRouteIndex',
            state: {
                tf_routeIndex: []
            }
        }]
    }

});

export default TrebleFetch

