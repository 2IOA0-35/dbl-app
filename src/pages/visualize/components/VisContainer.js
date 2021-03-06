import React, { useContext } from 'react';
import { GlobalContext } from './GlobalContext';
import { Row, Col, Result, Spin } from 'antd';
import HEBVisualization from './HEBVisualization';
import DFDVisualization from './DFDVisualization';
import SaveImage from './SaveImage';
import FDVisualization from './FDVisualization';
import FD3DVisualization from './FD3DVisualization';
import { DataContext } from '../../../context/data';

/**
 * Creates a container and renders the selected visualizations within it.
 */
export default function VisContainer() {
    const [ getOptions ] = useContext( GlobalContext );

    const contextID = 'Global';

    const { graph1, graph2 } = getOptions( contextID );

    // eslint-disable-next-line
    let [ dataset, setData, filename, setFilename, loading ] = React.useContext( DataContext );
    
    // Will render the appropriate visualization depending on the selected graph
    const renderVisualizations = ( graph ) => {
        switch ( graph ) {
            case 'Hierarchical Edge Bundling':
                return <HEBVisualization key={filename} />;
            case 'Disjoint Force-Directed':
                return <DFDVisualization key={filename} />;
            case 'Force-Directed Graph':
                return <FDVisualization key={filename} />;
            case 'Arc Diagram':
                return <h1>Not yet implemented!</h1>;
            case '3D Force-Directed Graph':
                return <FD3DVisualization key={filename} />;

            default:
                return <h1>Set a graph type in &#39;General Options&#39;</h1>;
        }
    };

    if( loading )
        return (
            <Row
                style={{
                    flexGrow: '1',
                    borderBottom: '1px solid rgba(124, 124, 124, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Spin/>
            </Row>
        );

    if ( !dataset )
        return (
            <Row
                style={{
                    flexGrow: '1',
                    borderBottom: '1px solid rgba(124, 124, 124, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Result
                    status='warning'
                    title='Please select a dataset from the dropdown at the top right of the sidebar.'
                />
            </Row>
        );

    return (
        <Row
            style={{
                flexGrow: '1',
                borderBottom: '1px solid rgba(124, 124, 124, 0.2)'
            }}
        >
            <Col style={{ position: 'relative' }} span={graph2 !== 'None' ? 12 : 24} id='graph1'>
                {renderVisualizations( graph1 )}
                {graph1 !== '3D Force-Directed Graph' ? <SaveImage id='graph1' /> : null}
            </Col>
            {graph2 !== 'None' && (
                <Col
                    span={12}
                    style={{ borderLeft: '1px solid rgba(124, 124, 124, 0.2)', position: 'relative' }}
                    id='graph2'
                >
                    {renderVisualizations( graph2 )}
                    {graph2 !== '3D Force-Directed Graph' ? <SaveImage id='graph2' /> : null}
                </Col>
            )}
        </Row>
    );
}
