import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

export const HETContext = createContext();

export function HETProvider(props) {
    const [ edgeSize, setEdgeSize ] = useState(1);
    const [ nodeSize, setNodeSize ] = useState(5);
    const [ dynamicEdges, setDynamicEdges ] = useState(false);
    const [ dynamicNodes, setDynamicNodes ] = useState(false);
    const [ groupBy, setGroupBy ] = useState();
    const [ colorBy, setColorBy ] = useState();

    return (
        <HETContext.Provider
            value={[
                edgeSize,
                setEdgeSize,
                nodeSize,
                setNodeSize,
                dynamicEdges,
                setDynamicEdges,
                dynamicNodes,
                setDynamicNodes,
                groupBy,
                setGroupBy,
                colorBy,
                setColorBy
            ]}
        >
            {props.children}
        </HETContext.Provider>
    );
}

HETProvider.propTypes = {
    children: PropTypes.node
};
