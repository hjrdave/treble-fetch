/*
    TrebleRoute
    Processes routes with react-router Route comp.
*/

import React, {Suspense, useEffect} from 'react';
import {updateStore, useTreble} from 'treble-gsm';
import {Route} from 'react-router-dom';

interface ITrebleRoute{
    children?: JSX.Element | JSX.Element[],
    RouteIndex: {
        path: string,
        exact: boolean,
        component: React.LazyExoticComponent<any>,
        data?: any
    }[]
}

export default function TrebleRoute({children, RouteIndex}: ITrebleRoute){

    //passed useTreble hook
    const [{}, dispatch] = useTreble();

    //proccesses routes from RouteIndex and returns
    const handleRoutes = () => {
        
        let Routes = RouteIndex?.map((route) => {

            //route component
            let Component = route.component;

            //adds trebleFetch prop to Route components. 
            //can specify data to be made available to component by default
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
        updateStore('updateTrebleFetchRouteIndex', RouteIndex, dispatch);
    },[]);

    return(
        <>
            <Suspense fallback={'Loading...'}>
                {handleRoutes()}
                {children}
            </Suspense>
        </>
    )
}