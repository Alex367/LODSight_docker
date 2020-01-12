import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import {Row, Col} from 'react-bootstrap'
import InputRange from 'react-input-range'
import {setGraphParams} from '../../actions/graphParamsActions'
import {getGraph} from '../../actions/graphActions'
import setModal from '../../actions/modalActions'
import setFilters from '../../actions/filtersActions'
import Spinner from './Spinner'
import FilterRows from './FilterRows'
import isEmpty from 'lodash/isEmpty'

class DatasetPicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPredicates: props.filters.selectedPredicates,
            selectedNamespaces: props.filters.selectedNamespaces,
            maxFrequency: props.filters.maxFrequency,
            minFrequency: props.filters.minFrequency,
            touched: false
        }
    }

    onCloseModal() {
        this.closeModal(false);
    };

    closeModal(saveState = true) {
        if (saveState) {
            this.props.actions.setFilters(
                {
                    selectedPredicates: this.state.selectedPredicates,
                    selectedNamespaces: this.state.selectedNamespaces,
                    maxFrequency: this.state.maxFrequency,
                    minFrequency: this.state.minFrequency
                });
        }
        this.props.actions.setModal({open: false});
    }

    onClickMultiple() {
        const {selectedPredicates, selectedNamespaces, minFrequency, maxFrequency, touched} = this.state;
        const graphParams = this.props.graphParams;
        let enable = touched;
        let params = {
            sumid: graphParams.sumid,
            //minfreq: graphParams.minfreq,
            minfreq: Math.floor((minFrequency / 100) * graphParams.minfreq),
            maxfreq: Math.ceil((maxFrequency / 100) * graphParams.maxfreq),
            p: [],
            ns: []
        };
        if (!isEmpty(selectedPredicates)) {
            params.p = selectedPredicates;
            enable = true;
        }
        if (!isEmpty(selectedNamespaces)) {
            params.ns = selectedNamespaces;
            enable = true;
        }

        if (enable) {
            this.props.actions.setGraphParams(params, false);
            this.props.actions.getGraph();
            this.closeModal();
        }
    }

    onSelectPredicate(id) {
        let selectedPredicates = this.state.selectedPredicates;
        const index = selectedPredicates.findIndex(i => i == id);
        if (index != -1) {
            selectedPredicates.splice(index, 1);
        } else {
            selectedPredicates.push(id);
        }
        this.setState({selectedPredicates: selectedPredicates});
    }

    onSelectNamespace(id) {
        let selectedNamespaces = this.state.selectedNamespaces;
        const index = selectedNamespaces.findIndex(i => i == id);
        if (index != -1) {
            selectedNamespaces.splice(index, 1);
        } else {
            selectedNamespaces.push(id);
        }
        this.setState({selectedNamespaces: selectedNamespaces});
    }

    setFrequency(value) {
        this.setState({maxFrequency: value.max, minFrequency: value.min, touched: true});
    }

    render() {
        const {selectedPredicates, selectedNamespaces, maxFrequency, minFrequency} = this.state;
        const {graph} = this.props;
        const predicates = graph.isFetching ? [] : graph.items.predicates;
        const namespaces = graph.isFetching ? [] : graph.items.namespaces;
        return (
            <div>
                {graph.isFetching ?
                    <div>
                        <div className="modal-header">
                            <button type="button" onClick={() => this.onCloseModal()}
                                    className="close">&times;</button>
                            <h4 className="modal-title">loading graph</h4>
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
                            <h4 className="modal-title">filter settings</h4>
                        </div>
                        <div className="modal-body">
                            <Row>
                                <Col md={5}>
                                    <div className="modal-inner">
                                        <Row className="horizontal-line">
                                            <h5>predicates</h5>
                                        </Row>
                                        <Row className="checkboxes-wrapper checkboxes-wrapper-lg datasetList">
                                            <FilterRows
                                                items={predicates}
                                                selected={selectedPredicates}
                                                onSelect={(id) => this.onSelectPredicate(id)}
                                            />
                                        </Row>
                                    </div>
                                </Col>
                                <Col md={7}>
                                    <div className="modal-inner">
                                        <Row className="horizontal-line">
                                            <h5>namespaces</h5>
                                        </Row>
                                        <Row className="checkboxes-wrapper checkboxes-wrapper-lg datasetList">
                                            <FilterRows
                                                items={namespaces}
                                                selected={selectedNamespaces}
                                                onSelect={(id) => this.onSelectNamespace(id)}
                                            />
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <div className="modal-inner">
                                        <Row>
                                            <h5>Detail range: <span
                                                className="label label-info">
                                                <span>{minFrequency}</span> %</span> -&nbsp;
                                                <span
                                                    className="label label-info">
                                                 <span>{maxFrequency}</span> %</span>
                                            </h5>
                                            <InputRange
                                                maxValue={100}
                                                minValue={1}
                                                formatLabel={value => "" +
                                                ""}
                                                value={{min: minFrequency, max: maxFrequency}}
                                                onChange={(value) => this.setFrequency(value)}/>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn button" onClick={() => this.onClickMultiple()}>
                                apply filter
                            </button>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

DatasetPicker.propTypes = {
    actions: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        graphParams: state.graphParams,
        graph: state.graph,
        filters: state.filters
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setGraphParams,
            getGraph,
            setModal,
            setFilters
        }, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetPicker);