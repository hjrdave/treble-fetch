import React from 'react';

const trebleImport = (importStatement: any) => {
    const Component:any = React.lazy(importStatement);
    Component.preload = importStatement;
    return Component;
};

export default trebleImport;