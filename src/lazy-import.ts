/*
    Lazy Import
    Creates lazy loaded dynamic imports and adds a preload function so links can preload on mouseover.
*/

import React from 'react';

export interface ILazyImport {
    (
        importStatement: () => Promise<{ default: React.ComponentType<any> }>
    ): React.LazyExoticComponent<any>
}

const lazyImport: ILazyImport = (importStatement) => {

    //makes importStatement a lazy import
    const Component = React.lazy(importStatement);

    //adds preload property to be called on mouseover
    (Component as any).preload = importStatement;

    return Component;
};

export default lazyImport;