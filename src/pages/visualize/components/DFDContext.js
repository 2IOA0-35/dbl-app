import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const DFDContext = createContext();

export function DFDProvider(props) {
    const [ edgeSize, setEdgeSize ] = useState(1);
    const [ nodeSize, setNodeSize ] = useState(5);
    const [ dynamicEdges, setDynamicEdges ] = useState(false);
    const [ dynamicNodes, setDynamicNodes ] = useState(false);
    const [ colorBy, setColorBy ] = useState();

    return (
        <DFDContext.Provider
            value={[
                edgeSize,
                setEdgeSize,
                nodeSize,
                setNodeSize,
                dynamicEdges,
                setDynamicEdges,
                dynamicNodes,
                setDynamicNodes,
                colorBy,
                setColorBy
            ]}
        >
            {props.children}
        </DFDContext.Provider>
    );
}

DFDProvider.propTypes = {
    children: PropTypes.node
};
