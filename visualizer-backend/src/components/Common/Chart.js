import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import {ForceGraph2D, ForceGraph3D} from 'react-force-graph-labeled-links'

import SpriteText from 'three-spritetext'
import Spinner from './Spinner'
import Message from './Message'
import {GraphData} from '../../utils/GraphData'
import Controls from '../Common/Controls'
import Search from '../Common/Search'
import Detail from '../Common/Detail'
import setDetail from '../../actions/detailActions'

class Chart extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showPrefix: false,
            isAnimated: true,
            is3D: false,
            groupedLinks: false,
            showLinkFrequency: true,
            selectedNode: null,
            search: "",
            warmup: 0
        }
    }

    componentDidUpdate(prevProps){
        const {graph} = this.props
        if(prevProps.graph.isFetching == true && graph.isFetching == false && graph.items && graph.items.links.length > 50){
            this.setState({
                showPrefix: false,
                groupedLinks: true,
                showLinkFrequency: false,
            })
        }
    }

    toggleAnimate() {
        this.setState({isAnimated: !this.state.isAnimated});
    }

    togglePrefixes() {
        this.setState({showPrefix: !this.state.showPrefix, warmup: 150});
    }

    toggleDimension() {
        this.setState({is3D: !this.state.is3D});
    }

    toggleGroupLinks() {
        this.setState({groupedLinks: !this.state.groupedLinks, warmup: 150});
    }

    toggleFrequency() {
        this.setState({showLinkFrequency: !this.state.showLinkFrequency, warmup: 150});
    }

    onLinkClick(link) {
        this.props.actions.setDetail(link);
    }

    search(value) {
        this.setState({search: value});
    }

    onNodeClick(node) {
        const selectedNode = this.state.selectedNode;
        if (selectedNode == node.id) {
            this.setState({selectedNode: null, warmup: 150});
        } else {
            this.setState({selectedNode: node.id, warmup: 150});
        }

    }

    render() {
        let data = null;
        let errors = [];
        const state = this.state;
        const dataConfig = {
            showPrefix: state.showPrefix,
            selectedNode: state.selectedNode,
            is3D: state.is3D,
            groupedLinks: state.groupedLinks,
            search: state.search.toLowerCase()
        }

        const {graph} = this.props
        let maxFrequency = 1
        const maxParticles = 15
        if (!graph.isFetching && !isEmpty(graph.items)) {
            const graphData = new GraphData(graph.items, dataConfig, this.props.graphColors)
            data = {
                nodes: graphData.nodes,
                links: graphData.links
            };
            errors = graphData.errors
            maxFrequency = graph.items.maxFrequency
        }
        return (
            <div className="chart-wrapper">
                {
                    graph.isFetching ?
                        <Spinner/>
                        :
                        !isEmpty(errors) ?
                            <Message type="error" items={errors}/>
                            :
                            isEmpty(graph.items) ?
                                <Message type="dataset"/>
                                :
                                isEmpty(data.nodes) && (!isEmpty(this.props.filters.selectedPredicates) || !isEmpty(this.props.filters.selectedNamespaces)) ?
                                    <Message type="filterEmpty"/>
                                    :
                                    isEmpty(data.nodes) ?

                                        !state.search ?
                                            <Message type="datasetEmpty"/>
                                            :
                                            <div>
                                                <Message type="searchEmpty"/>
                                                <Search
                                                    search={(value) => this.search(value)}
                                                    searchValue={state.search}
                                                />
                                            </div>

                                        :
                                        <div>
                                            {
                                                state.is3D ?
                                                    <ForceGraph3D
                                                        cooldownTicks={500}
                                                        warmupTicks={state.warmup}
                                                        cooldownTime={8000}
                                                        backgroundColor="#FFFFFF"
                                                        graphData={data}
                                                        stopAnimation={!state.isAnimated}
                                                        linkDirectionalArrowLength={3.5}
                                                        linkDirectionalArrowRelPos={1}
                                                        linkLabel="label"
                                                        linkCurvature="curvature"
                                                        linkDirectionalParticleWidth={1}
                                                        linkDirectionalParticles={(link) => {
                                                            return state.showLinkFrequency ? Math.ceil(link.frequency / maxFrequency * maxParticles) : 0

                                                        }
                                                        }
                                                        nodeLabel=""
                                                        linkLabeled={true}
                                                        onLinkClick={(data) => this.onLinkClick(data)}
                                                        onNodeClick={(data) => this.onNodeClick(data)}
                                                        nodeThreeObject={(node) => {
                                                            const label = node.showPrefix ? node.prefix + ':' + node.name : node.name;
                                                            const sprite = new SpriteText(label);
                                                            sprite.color = node.color;
                                                            sprite.textHeight = 5;
                                                            return sprite;
                                                        }
                                                        }
                                                    />
                                                    :
                                                    <ForceGraph2D
                                                        cooldownTicks={500}
                                                        warmupTicks={state.warmup}
                                                        cooldownTime={8000}
                                                        graphData={data}
                                                        stopAnimation={!state.isAnimated}
                                                        linkDirectionalArrowLength={3.5}
                                                        linkDirectionalArrowRelPos={1}
                                                        linkLabel=""
                                                        nodeLabel=""
                                                        linkLabeled={true}
                                                        linkCurvature="curvature"
                                                        linkDirectionalParticleWidth={3}
                                                        linkDirectionalParticles={(link) => {
                                                            return state.showLinkFrequency ? Math.ceil(link.frequency / maxFrequency * maxParticles) : 0

                                                        }
                                                        }
                                                        onLinkClick={(data) => this.onLinkClick(data)}
                                                        onNodeClick={(data) => this.onNodeClick(data)}
                                                        nodeCanvasObject={(node, ctx, globalScale) => {
                                                            const label = node.showPrefix ? node.prefix + ':' + node.name : node.name;
                                                            const fontSize = 12 / globalScale;
                                                            ctx.font = `${fontSize}px Sans-Serif`;
                                                            const textWidth = ctx.measureText(label).width;
                                                            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);
                                                            const radius = 4.5;

                                                            ctx.fillStyle = node.color;
                                                            ctx.beginPath();
                                                            ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, true);
                                                            ctx.closePath();
                                                            ctx.fill();

                                                            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                                                            ctx.fillRect(node.x + radius * 1.35, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

                                                            ctx.fillStyle = node.color;
                                                            ctx.textAlign = 'left';
                                                            ctx.textBaseline = 'middle';
                                                            ctx.fillText(label, node.x + radius * 1.35, node.y);
                                                        }}
                                                    />
                                            }
                                            <Controls
                                                animate={() => this.toggleAnimate()}
                                                togglePrefixes={() => this.togglePrefixes()}
                                                toggleDimension={() => this.toggleDimension()}
                                                toggleGroupLinks={() => this.toggleGroupLinks()}
                                                toggleFrequency={() => this.toggleFrequency()}
                                                isAnimated={state.isAnimated}
                                                isPrefixes={state.showPrefix}
                                                is3D={state.is3D}
                                                groupedLinks={state.groupedLinks}
                                                showLinkFrequency={state.showLinkFrequency}
                                            />
                                            <Search
                                                search={(value) => this.search(value)}
                                                searchValue={state.search}
                                            />
                                            <Detail/>
                                        </div>
                }
            </div>
        )
    }
}

Chart.propTypes = {
    graph: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        graph: state.graph,
        filters: state.filters,
        graphColors: state.graphColors
    };
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setDetail
        }, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chart);