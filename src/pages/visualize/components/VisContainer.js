import React, { useContext } from 'react';
import { GlobalContext } from './GlobalContext';
import { Row, Col } from 'antd';
import HEBVisualization from './HEBVisualization';
import DFDVisualization from './DFDVisualization';

export default function VisContainer() {
    const [ getOptions ] = useContext(GlobalContext);

    const contextID = 'Global';

    const { graph1, graph2 } = getOptions(contextID);

    // Will render the appropriate visualization depending on the selected graph
    const renderVisualizations = (graph) => {
        switch (graph) {
            case 'Hierarchical Edge Bundling':
                return <HEBVisualization />;
            case 'Disjoint Force-Directed':
                return <DFDVisualization />;
            case 'Force-Directed Graph':
                return <h1>Not yet implemented!</h1>;
            case 'Arc Diagram':
                return <h1>Not yet implemented!</h1>;
            case '3D force directed graph':
                return <h1>Not yet implemented!</h1>;

            default:
                return <h1>Set a graph type in &#39;General Options&#39;</h1>;
        }
    };

    return (
        <Row style={{ flexGrow: '1' }}>
            <Col span={graph2 !== 'None' ? 12 : 24}>{renderVisualizations(graph1)}</Col>
            {graph2 !== 'None' && (
                <Col span={12} style={{ borderLeft: '2px solid gray' }}>
                    {renderVisualizations(graph2)}
                </Col>
            )}
        </Row>
    );
}
