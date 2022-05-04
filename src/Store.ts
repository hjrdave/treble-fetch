import { createStore, TrebleGSM, useTreble } from 'treble-gsm';
import { TrebleFetch } from './interfaces';

interface IState {
    tf_routeIndex: TrebleFetch.RouteIndexObject[];
}
const actionKeys = {
    ['tf_updateRouteIndex']: 'tf_updateRouteIndex'
};
type TActions = typeof actionKeys;
export interface IDispatchers extends TrebleGSM.Dispatchers { };

const TFStore = createStore([
    {
        action: actionKeys.tf_updateRouteIndex,
        state: {
            tf_routeIndex: []
        }
    }
]);

const useStore = () => useTreble<IState, IDispatchers, TActions>();

export { useStore }
export default TFStore;