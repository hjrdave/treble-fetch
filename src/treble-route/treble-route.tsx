import React, {Suspense, useEffect} from 'react';
import {useTreble, updateStore} from 'treble-gsm';

interface ITrebleRoute{
    children: JSX.Element | JSX.Element[],
    routes: {
        path: string,
        exact: boolean,
        component: JSX.Element
    }[]
}

export default function TrebleRoute({children, routes}: ITrebleRoute){

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