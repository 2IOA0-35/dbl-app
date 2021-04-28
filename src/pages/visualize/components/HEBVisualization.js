import React, { useContext } from 'react';
import { GlobalContext } from './GlobalContext';

export default function HEBOptions() {
    const [ getOptions ] = useContext(GlobalContext);

    const visID = 'Hierarchical Edge Bundling';

    const { edgeSize, nodeSize, dynamicEdges, dynamicNodes, groupBy, colorBy } = getOptions(visID);

    return (
        <div>
            <p>Temporary to show that passing data works:</p>
            <p>
                {edgeSize +
                    ' - ' +
                    nodeSize +
                    ' - ' +
                    dynamicEdges +
                    ' - ' +
                    dynamicNodes +
                    ' - ' +
                    groupBy +
                    ' - ' +
                    colorBy}
            </p>
        </div>
    );
}
