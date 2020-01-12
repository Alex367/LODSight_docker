import React from 'react'
import PropTypes from 'prop-types'
import {Col} from "react-bootstrap"

const FilterRows = ({items, selected, onSelect}) => {
    const rows = items.map((item, index) =>
        <div key={index}>
                <Col xs={12} className="checkbox abc-checkbox abc-checkbox-primary padding-0">
                    <input type="checkbox" id={"i_" + item.id} onChange={() => onSelect(item.id)}
                           checked={selected.indexOf(item.id) == -1 ? false : true}/>
                    <label htmlFor={"i_" + item.id}><span>{item.prefix}</span><span>:{item.name}</span></label>
                </Col>
        </div>
    )
    return (
        <div>
            {rows}
        </div>
    );
}

FilterRows.propTypes = {
    items: PropTypes.array.isRequired,
    selected: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired
}

FilterRows.defaultProps = {
    items: [],
    selected: []
}

export default FilterRows;