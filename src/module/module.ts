/*
    Treble Fetch Module
*/

import { createModule } from 'treble-gsm';
import TFStore from '../Store';

const TrebleFetchM = createModule({

    name: 'treble-fetch',
    namespace: 'tf',
    extendStore: TFStore

});

export default TrebleFetchM

