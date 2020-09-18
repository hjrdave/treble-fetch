import React from 'react';

const useNonInitialEffect = (effect: React.EffectCallback, deps?: React.DependencyList) => {
    const initialRender = React.useRef(true);

    React.useEffect(() => {
        let effectReturns: void | (() => void | undefined) = () => { };

        if (initialRender.current) {
            initialRender.current = false;
        } else {
            effectReturns = effect();
        }

        if (effectReturns && typeof effectReturns === "function") {
            return effectReturns;
        }
    }, deps);
};

export default useNonInitialEffect;
