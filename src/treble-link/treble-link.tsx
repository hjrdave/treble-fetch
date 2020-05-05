/*
  Treble Link
  Wrapper around React Router Link to allow for prefetching dynamic imports and api routes.
*/
import React from 'react';
import { matchPath, Link } from "react-router-dom";
import {useTreble, updateStore} from "treble-gsm";
import prefetch from '../prefetch';


interface Props{
  to: string | any,
  prefetch?: string[],
  children: React.ReactNode,
  [key: string]: any
}

export default function TrebleLink(props: Props){
    const {to, prefetch: prefetchProp, children} = props;

    const [{trebleFetchRouteIndex, trebleFetchCache}, dispatch] = useTreble();

    //find the component attached to Route
    const findComponentForRoute = (path: string, routes: {path: string, exact: boolean, component: JSX.Element}[]) => {
      const matchingRoute = routes.find((route) =>
        matchPath(path, {
          path: route.path,
          exact: route.exact
        })
      );
      return matchingRoute ? matchingRoute.component : null;
    };
    
    //preload Route chunck on mouseover
    const preloadRouteComponent = (path: string, globalCache: {path: string, exact: boolean, component: JSX.Element}[]) => {
      const component = findComponentForRoute(path, globalCache);
      if (component && (component as any).preload) {
        (component as any).preload();
      }
    };

    //prefetch specified api routes on mouseover
    const prefetchData = async (routeArray: string[]) => {
        
      //Compares cached routes to routeArray and returns false if no new routes are added
      let routeCheck = routeArray.map((route) => { 
        if(!(route in trebleFetchCache)){
          return true;
        }
        return false;
      }).includes(false);
      
      //if routeCheck is true it will continue the prefetching
      if(!(routeCheck)){
        //maps promises first and then resolves
        let cachedData = Promise.all(
          routeArray?.map(async (route: string) => {
            if(!(route in trebleFetchCache)){
              let prefetchedRoute = await prefetch(route);
              return {
                ...trebleFetchCache,
                [route]: prefetchedRoute
              }
            }
            return {
              ...trebleFetchCache
            }
          })
        );

        //waits for promises to resolve
        let resolvedRoutes = await cachedData;

        //update treble fetch cache in treble store
        updateStore('updateTrebleFetchCache', resolvedRoutes[0], dispatch);
      }
    }
    return(
        <>
            <Link onMouseEnter={() => {
              preloadRouteComponent(to, trebleFetchRouteIndex); 
              (prefetchProp) ? prefetchData(prefetchProp) : null;
            }} 
            {...props}
            >
              {children}
            </Link>
        </>
    )
}