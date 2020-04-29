import React, {Suspense, useEffect} from 'react';
import {updateStore, useTreble} from 'treble-gsm';

interface ITrebleRoute{
    children: JSX.Element | JSX.Element[],
    routes: {
        path: string,
        exact: boolean,
        component: any
    }[]
}

export default function TrebleRoute({children, routes}: ITrebleRoute){

    //passed useTreble hook
    const [{}, dispatch] = useTreble();

    //Put routes into Store
    useEffect(() => {
      updateStore('globalCache', routes, dispatch);
    },[]);
    return(
        <>
            <Suspense fallback={'Loading...'}>
                {children}
            </Suspense>
        </>
    )
}