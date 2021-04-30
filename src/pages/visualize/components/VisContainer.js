import React, { useContext } from 'react';
import { GlobalContext } from './GlobalContext';
import { Row, Col } from 'antd';
import HEBVisualization from './HEBVisualization';
import DFDVisualization from './DFDVisualization';
import SaveButton from './SaveButton';

export default function VisContainer() {
    const [ getOptions ] = useContext(GlobalContext);

    const contextID = 'Global';

    const { graph1, graph2 } = getOptions(contextID);

    // Will render the appropriate visualization depending on the selected graph
    const renderVisualizations = (graph) => {
        switch (graph) {
            case 'Hierarchical Edge Bundling':
                return (
                    <HEBVisualization url='date,fromId,fromEmail,fromJobtitle,toId,toEmail,toJobtitle,messageType,sentiment
                2000-08-13,96,matthew.lenhart@enron.com,Employee,77,eric.bass@enron.com,Trader,CC,0.0136986301369863
                2000-08-13,96,matthew.lenhart@enron.com,Employee,112,phillip.m.love@enron.com,Unknown,TO,0.0136986301369863' />
                );
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
        <Row
            style={{
                flexGrow: '1',
                borderBottom: '1px solid rgba(124, 124, 124, 0.2)'
            }}
        >
            <Col style={{ position: 'relative' }} span={graph2 !== 'None' ? 12 : 24} id='graph1'>
                {renderVisualizations(graph1)}
                <SaveButton id='graph1' />
            </Col>
            {graph2 !== 'None' && (
                <Col
                    span={12}
                    style={{ borderLeft: '1px solid rgba(124, 124, 124, 0.2)', position: 'relative' }}
                    id='graph2'
                >
                    {renderVisualizations(graph2)}
                    <SaveButton id='graph2' />
                </Col>
            )}
        </Row>
    );
}
