/*
    IndexRoutes
    Processes routes with react-router Route comp.
*/

import React, {Suspense, useEffect} from 'react';
import {updateStore, useTreble} from 'treble-gsm';
import {Route} from 'react-router-dom';

interface Props{
    children?: JSX.Element | JSX.Element[],
    routes: {
        path: string,
        exact: boolean,
        component: React.LazyExoticComponent<any>,
        data?: any
    }[]
}

export default function IndexRoutes({children, routes}: Props){

    //passed useTreble hook
    const [{}, dispatch] = useTreble();

    //proccesses routes from RouteIndex and returns
    const handleRoutes = () => {
        
        let renderedRoutes = routes?.map((route) => {

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
        return renderedRoutes;
    }

    //Put routes into Store
    useEffect(() => {
        updateStore('updateTrebleFetchRouteIndex', routes, dispatch);
    },[]);

    return(
        <>
            <Suspense fallback={'Loading...'}>
                {children}
                {handleRoutes()}
            </Suspense>
        </>
    )
}