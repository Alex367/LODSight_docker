import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-bootstrap'
import {setGraphParams} from '../../actions/graphParamsActions'
import {getGraph} from '../../actions/graphActions'
import {getDatasets, setSelectedDatasets} from '../../actions/datasetsActions'
import setFilters from '../../actions/filtersActions'
import setModal from '../../actions/modalActions'
import DatasetRows from './DatasetRows'
import Spinner from './Spinner'
import isEmpty from 'lodash/isEmpty'

class DatasetPicker extends React.Component {

    constructor(props) {
        super(props);
        props.actions.getDatasets()
        this.state = {
            selectedDatasets: props.selectedDatasets
        }
    }

    onCloseModal() {
        this.closeModal(false);
    };

    closeModal(saveState = true) {
        if (saveState) {
            this.props.actions.setSelectedDatasets(this.state.selectedDatasets);
        }
        this.props.actions.setModal({open: false});
    }

    onClickSingle(id) {
        this.setState(
            {selectedDatasets: [id]},
            () => this.onClickMultiple()
        );
    }

    onClickMultiple() {
        const indexes = this.state.selectedDatasets;
        const datasets = this.props.datasets.items;
        let params = {
            sumid: [],
            minfreq: datasets.minfreq,
            maxfreq: datasets.maxfreq,
        };
        if (!isEmpty(indexes)) {
            indexes.map(index => {
                    params.sumid.push(datasets.data[index].sumid);
                }
            )
            this.props.actions.setGraphParams(params, false);
            this.props.actions.getGraph();
            this.props.actions.setFilters({
                selectedPredicates: [],
                selectedNamespaces: [],
                maxFrequency: 100,
                minFrequency: Math.floor(params.minfreq / 100)
            });
            this.closeModal();
        }
    }

    onSelect(id) {
        let selectedDatasets = this.state.selectedDatasets;
        const index = selectedDatasets.findIndex(i => i == id);
        if (index != -1) {
            selectedDatasets.splice(index, 1);
        } else {
            selectedDatasets.push(id);
        }
        this.setState({selectedDatasets: selectedDatasets});
    }

    render() {
        const {datasets} = this.props;
        const datasetItems = datasets.isFetching ? [] : datasets.items.data;
        return (
            <div>
                {datasets.isFetching ?
                    <div>
                        <div className="modal-header">
                            <button type="button" onClick={() => this.onCloseModal()}
                                    className="close">&times;</button>
                            <h4 className="modal-title">loading datasets</h4>
                        </div>
                        <div className="modal-body">
                            <Spinner/>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="modal-header">
                            <button type="button" onClick={() => this.onCloseModal()}
                                    className="close">&times;</button>
                            <h4 className="modal-title">select dataset</h4>
                        </div>
                        <div className="modal-body">
                            <div className="modal-inner">
                                <Row className="horizontal-line">
                                    <Col xs={8} md={9}>
                                        <Row>
                                            <Col md={5} className="padding-0">
                                                <h5>dataset</h5>
                                            </Col>
                                            <Col md={7} className="padding-0">
                                                <h5>endpoint</h5>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={4} md={3}>
                                        <h5>paths found</h5>
                                    </Col>
                                </Row>
                                <Row className="checkboxes-wrapper checkboxes-wrapper-lg datasetList">
                                    <ul>
                                        <DatasetRows
                                            items={datasetItems}
                                            selected={this.state.selectedDatasets}
                                            onClickSingle={(index) => this.onClickSingle(index)}
                                            onSelect={(index) => this.onSelect(index)}
                                        />
                                    </ul>
                                </Row>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn button" onClick={() => this.onClickMultiple()}>
                                load selected
                            </button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

DatasetPicker.propTypes = {
    datasets: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    selectedDatasets: PropTypes.array.isRequired,
}

function mapStateToProps(state) {
    return {
        datasets: state.datasets,
        selectedDatasets: state.selectedDatasets
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setGraphParams,
            getDatasets,
            setSelectedDatasets,
            getGraph,
            setFilters,
            setModal
        }, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetPicker);