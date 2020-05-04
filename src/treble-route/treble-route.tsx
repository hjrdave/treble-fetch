import React, {Suspense, useEffect} from 'react';
import {updateStore, useTreble} from 'treble-gsm';
import {Route} from 'react-router-dom';

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
    const [{trebleFetchCache}, dispatch] = useTreble();
    const handleRoutes = () => {
        
        let Routes = RouteIndex?.map((route) => {
            let Component = route.component;
            let trebleFetch = {
                data: route.data || []
            }
            return(
                <Route exact key={route.path} path={route.path} render={(props) => <Component {...props} trebleFetch={trebleFetch}/>}/>
            )
        });
        return Routes;
    }

    //Put routes into Store
    useEffect(() => {
        updateStore('globalCache', RouteIndex, dispatch);
    },[]);

    useEffect(() => {
        
        console.log(trebleFetchCache);
    },[trebleFetchCache]);

    return(
        <>
            <Suspense fallback={'Loading...'}>
                {handleRoutes()}
                {children}
            </Suspense>
        </>
    )
}