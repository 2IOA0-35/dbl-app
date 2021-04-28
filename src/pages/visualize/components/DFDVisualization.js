import React, { useContext } from 'react';
import { DFDContext } from './DFDContext';

export default function DFDOptions() {
    const [ edgeSize, , nodeSize, , dynamicEdges, , dynamicNodes, , colorBy ] = useContext(DFDContext);

    return (
        // D3 visualization should go here
        <div>
            <p>Temporary to show that passing data works:</p>
            <p>{edgeSize + ' - ' + nodeSize + ' - ' + dynamicEdges + ' - ' + dynamicNodes + ' - ' + colorBy}</p>
        </div>
    );
}
