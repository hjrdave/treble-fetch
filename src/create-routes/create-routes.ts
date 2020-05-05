/*
    createRoutes.ts
    Used to index routes and add trebleFetch data to them.
*/

interface ICreateRoutes{
    (
        routes:{
            path: string,
            exact: boolean,
            component: React.LazyExoticComponent<any>
        }[]
    ): {
        path: string,
        exact: boolean,
        component: React.LazyExoticComponent<any>
    }[]
}

const createRoutes: ICreateRoutes = (routes) => {
    return routes;
}

export default createRoutes;