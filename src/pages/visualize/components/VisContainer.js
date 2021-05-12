import React, { useContext } from 'react';
import { GlobalContext } from './GlobalContext';
import { Row, Col, Result } from 'antd';
import HEBVisualization from './HEBVisualization';
import DFDVisualization from './DFDVisualization';
import SaveButton from './SaveButton';
import FDVisualization from './FDVisualization';
import { DataContext } from '../../../context/data';

export default function VisContainer() {
    const [ getOptions ] = useContext(GlobalContext);

    const contextID = 'Global';

    const { graph1, graph2 } = getOptions(contextID);
    
    let [ dataset ] = React.useContext( DataContext );

    // Will render the appropriate visualization depending on the selected graph
    const renderVisualizations = (graph) => {
        switch (graph) {
            case 'Hierarchical Edge Bundling':
                return <HEBVisualization />;
            case 'Disjoint Force-Directed':
                return <DFDVisualization />;
            case 'Force-Directed Graph':
                return <FDVisualization />;
            case 'Arc Diagram':
                return <h1>Not yet implemented!</h1>;
            case '3D force directed graph':
                return <h1>Not yet implemented!</h1>;

            default:
                return <h1>Set a graph type in &#39;General Options&#39;</h1>;
        }
    };

    if( !dataset )
        return <Row
            style={{
                flexGrow: '1',
                borderBottom: '1px solid rgba(124, 124, 124, 0.2)',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Result
                status='warning'
                title='No dataset has been selected.'
            />
        </Row>;

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
