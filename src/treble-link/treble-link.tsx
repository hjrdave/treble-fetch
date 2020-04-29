import React from 'react';
import { matchPath, Link } from "react-router-dom";
import {useTreble} from "treble-gsm";

export default function TrebleLink(props: any){

    const [{globalCache}] = useTreble();

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

    return(
        <>
            <Link onMouseEnter={() => preloadRouteComponent(props.to)} {...props}>{props.children}</Link>
        </>
    )
}