import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import Navigation from '../Common/Navigation'
import Chart from '../Common/Chart'
import ModalWrapper from '../Common/ModalWrapper'
import {setGraphParams} from '../../actions/graphParamsActions'
import {getGraph} from '../../actions/graphActions'
import setModal from '../../actions/modalActions'

class Main extends React.Component {

    constructor(props, context) {
        super(props);
        const queryParams = context.router.route.location.search;
        let params = {};
        if (queryParams) {
            const queryString = require('query-string');
            params = queryString.parse(queryParams);
            props.actions.setGraphParams(params, true);
            props.actions.getGraph();
        }else{
            props.actions.setModal({open: true});
        }
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Chart/>
                <ModalWrapper/>
            </div>
        );
    }
}

Main.contextTypes = {
    router: PropTypes.object.isRequired
}

Main.propTypes = {
    actions: PropTypes.object.isRequired,
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setGraphParams,
            getGraph,
            setModal
        }, dispatch)
    };
}


export default connect(
    null,
    mapDispatchToProps
)(Main);