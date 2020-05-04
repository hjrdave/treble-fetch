import React from 'react';
import { matchPath, Link } from "react-router-dom";
import {useTreble, updateStore} from "treble-gsm";
import prefetch from '../prefetch';

export default function TrebleLink(props: any){

    const [{globalCache, trebleFetchCache}, dispatch] = useTreble();

    const findComponentForRoute = (path: any, routes: any) => {
        const matchingRoute = routes.find((route: any) =>
          matchPath(path, {
            path: route.path,
            exact: route.exact
          })
        );
        return matchingRoute ? matchingRoute.component : null;
      };

      const preloadRouteComponent = (path: any) => {
        const component = findComponentForRoute(path, globalCache);
        if (component && component.preload) {
          component.preload();
        }
      };

      const prefetchData = async (routeArray: string[]) => {
        
        let routeCheck = routeArray.map((route) => { 
          if(!(route in trebleFetchCache)){
            return true;
          }
          return false;
        }).includes(false);
        
        if(!(routeCheck)){
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
          let resolvedRoutes = await cachedData;
          updateStore('updateTrebleFetchCache', resolvedRoutes[0], dispatch);
        }
      }
  
      
    return(
        <>
            <Link onMouseEnter={() => {preloadRouteComponent(props.to); (props.prefetch) ? prefetchData(props.prefetch) : null}} {...props}>{props.children}</Link>
        </>
    )
}