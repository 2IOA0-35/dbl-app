import React, { useContext } from 'react';
import { HETContext } from './HETContext';

export default function HETOptions() {
    const [ edgeSize, , nodeSize, , dynamicEdges, , dynamicNodes, , groupBy, , colorBy ] = useContext(HETContext);

    return (
        // D3 visualization should go here
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
