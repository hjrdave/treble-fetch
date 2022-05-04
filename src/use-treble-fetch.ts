import React from 'react';
import { TrebleFetch } from './interfaces';
import { useStore } from './Store';

const useTrebleFetch = () => {

    const [State, Store] = useStore();
    const routeIndex = State.tf_routeIndex;

    //creates route index in global store
    const createRouteIndex = (routes: TrebleFetch.RouteObject[]) => {

        const indexRoute = routes.filter((route) => (route.index)).map((item) => ({ path: (item?.path) ? item.path : '/', element: item.element }))[0];
        const pathRoot = indexRoute.path;
        let routeArray: { path: string, element?: React.ReactNode, preload?: TrebleFetch.Preload }[] = [];
        routes.forEach((item1) => {

            const preload: TrebleFetch.Preload = (item1?.element?.preload) ? item1?.element?.preload : item1?.element?.props?.children?.type?.preload;
            routeArray = [...routeArray, { path: `${pathRoot}${(item1.path) ? item1.path : ''}`, element: item1.element, preload: preload }];

            item1?.children?.forEach((item2) => {

                const preload2: TrebleFetch.Preload = (item2?.element?.preload) ? item2?.element?.preload : item2?.element?.props?.children?.type?.preload;
                routeArray = [...routeArray, { path: `${pathRoot}${item1.path}/${(item2.path) ? item2.path : ''}`, element: item2.element, preload: preload2 }];

                item2?.children?.forEach((item3) => {

                    const preload3: TrebleFetch.Preload = (item3?.element?.preload) ? item3?.element?.preload : item3?.element?.props?.children?.type?.preload;
                    routeArray = [...routeArray, { path: `${pathRoot}${item1.path}/${item2.path}/${(item3.path) ? item3.path : ''}`, element: item3.element, preload: preload3 }];

                    item3?.children?.forEach((item4) => {
                        const preload4: TrebleFetch.Preload = (item4?.element?.preload) ? item4?.element?.preload : item4?.element?.props?.children?.type?.preload;
                        routeArray = [...routeArray, { path: `${pathRoot}${item1.path}/${item2.path}/${item3.path}/${(item4.path) ? item4.path : ''}`, element: item4.element, preload: preload4 }];
                    });

                });
            });
        });
        Store.update('tf_updateRouteIndex', routeArray);
    };

    //preload Route Chunk
    const preloadRoute = (path: string) => {
        // setTimeout(() => {
        //     const lazyComp = routeIndex.find((route) => (route.path === path));
        //     if (lazyComp) {
        //         if (lazyComp.preload) {
        //             lazyComp.preload();
        //         }
        //     }
        // }, 0);
    };

    return {
        createRouteIndex,
        routeIndex,
        preloadRoute
    }

};

export default useTrebleFetch;