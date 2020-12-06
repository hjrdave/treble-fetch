import React from 'react';
import { useTreble } from 'treble-gsm';
import { TStore } from '../treble-fetch-store';

const useLogger = () => {

    const [{ trebleFetchLog, trebleFetchLoaders }, Store] = useTreble() as TStore;
    const { errors: storeErrors } = trebleFetchLog;

    const [errors, setErrors] = React.useState(trebleFetchLog.errors);
    const [loaders, setLoaders] = React.useState(trebleFetchLoaders);
    const updateErrors = (error: any) => {
        Store.update('updateTrebleFetchLog', {
            ...trebleFetchLog,
            errors: [
                ...trebleFetchLog.errors,
                {
                    type: 'critical',
                    message: error
                }
            ]
        })
    }
    const updateLoaders = (loader: boolean) => {
        Store.update('updateTrebleFetchLoaders', [
            {
                type: 'manual',
                routeIndex: '',
                loading: loader
            },
            ...trebleFetchLoaders
        ])
    }

    React.useEffect(() => {
        setErrors(storeErrors);
        setLoaders(trebleFetchLoaders);
    }, [storeErrors, trebleFetchLoaders]);

    return {
        errors,
        loaders,
        updateErrors,
        updateLoaders
    }
}

export default useLogger;