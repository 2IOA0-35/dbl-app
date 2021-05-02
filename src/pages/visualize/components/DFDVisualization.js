import React, { useContext } from 'react';
import { GlobalContext } from './GlobalContext';

export default function DFDOptions() {
    const [ getOptions ] = useContext(GlobalContext);

    const visID = 'Disjoint Force-Directed';

    const { edgeSize, nodeSize, dynamicEdges, dynamicNodes, colorBy } = getOptions(visID);

    return (
        // D3 visualization should go here
        <div>
            <h1 style={{ margin: '10px 20px' }}>{visID}</h1>
            <p>Temporary to show that passing data works:</p>
            <p>{edgeSize + ' - ' + nodeSize + ' - ' + dynamicEdges + ' - ' + dynamicNodes + ' - ' + colorBy}</p>
        </div>
    );
}
