import React, {Suspense, useEffect} from 'react';
import {updateStore, useTreble} from 'treble-gsm';
import {Route} from 'react-router-dom';
import uniqid from 'uniqid';

interface ITrebleRoute{
    children?: JSX.Element | JSX.Element[],
    RouteIndex: {
        path: string,
        exact: boolean,
        component: any,
        data?: any
    }[]
}

export default function TrebleRoute({children, RouteIndex}: ITrebleRoute){

    //passed useTreble hook
    const [{}, dispatch] = useTreble();

    //Put routes into Store
    useEffect(() => {
      updateStore('globalCache', RouteIndex, dispatch);
    },[]);
    return(
        <>
            <Suspense fallback={'Loading...'}>
                {
                    RouteIndex?.map(route => {
                        let Component = route.component;
                        let trebleFetch = {
                            data: route.data
                        }
                        return(
                                (route.data) ?
                            <Route exact key={uniqid()} path={route.path} component={() => <Component trebleFetch={trebleFetch}/>}/> :
                            <Route exact key={uniqid()} path={route.path} component={() => <Component/>} />
                        )
                    })
                }
                {children}
            </Suspense>
        </>
    )
}