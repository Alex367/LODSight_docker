import React from 'react'
import PropTypes from 'prop-types'
import {Col, Row} from "react-bootstrap"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const DatasetRows = ({items, selected, onClickSingle, onSelect}) => {

    const rows = items.map((item, index) =>
        <div key={index}>
            <Col xs={8} md={9}>
                <Row>
                    <Col md={5} className="checkbox abc-checkbox abc-checkbox-primary padding-0">
                        <input type="checkbox" id={"i_" + item.sumid} onChange={() => onSelect(index)} checked={selected.indexOf(index) == -1 ? false : true}/>
                        <label htmlFor={"i_" + item.sumid}>{item.dataset}</label>
                    </Col>
                    <Col md={7} className="datasetItem">
                        <div className="margin-v-5">{item.endpoint}</div>
                    </Col>
                </Row>
            </Col>
            <Col xs={4} md={3}>
                <Row>
                    <Col md={6} xs={4}>
                        <div className="margin-v-5">{item.pathCount}</div>
                    </Col>
                    <Col xs={8} md={6} className="button-small">
                        <div className="margin-v-5">
                            <button type="button" className="btn button" onClick={() => onClickSingle(index)}>
                                                <span className="hidden visible-xs">
                        <FontAwesomeIcon icon="arrow-circle-right"/>
                    </span>
                                <span className="hidden-xs">load</span>
                            </button>
                        </div>
                    </Col>
                </Row>
            </Col>
        </div>
    )
    return (
        <div>
            {rows}
        </div>
    );
}

DatasetRows.propTypes = {
    items: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    onClickSingle: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
}

DatasetRows.defaultProps = {
    items: []
}

export default DatasetRows;