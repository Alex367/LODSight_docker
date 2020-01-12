import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import isEmpty from 'lodash/isEmpty'
import setDetail from '../../actions/detailActions'

const classNames = require("classnames");

class Detail extends React.Component {

    onClose() {
        this.props.actions.setDetail({})
    }

    render() {
        const {detail} = this.props;
        let labels, source, target = null;
        if(!isEmpty(detail)){
            labels = detail.label.split("<br>").map((item, index) =>
                <li key={index}>{item}</li>
            )
            source = detail.source.name;
            target = detail.target.name;
        }
        return (
            <div className={classNames("detail-box", !isEmpty(detail) ? "open" : "")}>
                <div className="detail-box-close">
                    <span>
                       <FontAwesomeIcon icon="arrow-left" size="2x" onClick={() => this.onClose()} title="close"/>
                    </span>
                </div>
                <div className="detail-box-inner">
                    <h4>Available predicates</h4>
                    <div>
                        <span>source: </span>{source}
                    </div>
                    <div>
                        <span>target: </span>{target}
                    </div>
                    <div>
                        <span>predicates: </span>
                        <ul>
                            {labels}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

Detail.propTypes = {
    detail: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        detail: state.detail
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
)(Detail);