import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import setModal from '../../actions/modalActions'
import isEmpty from 'lodash/isEmpty'

class Message extends React.Component {

    onButtonClick(content) {
        this.props.actions.setModal({open: true, content: content});
    }

    render() {
        let info = '';
        let button = [];
        let error = [];
        let modal = ['datasets'];
        switch (this.props.type) {
            case 'dataset':
                info = 'No dataset selected'
                button = ['Select dataset']
                break
            case 'filterEmpty':
                info = 'No data match the specified filters. Please try to update filters'
                button = ['Update filters']
                modal = ['filter']
                break
            case 'datasetEmpty':
                info = 'Nothing to show in selected dataset. Please try another dataset or update filter.'
                button = ['Select another dataset', 'Update filter']
                modal = ['datasets', 'filter']
                break
            case 'searchEmpty':
                info = 'No results found for searched string. Please search something different or try to update filter.'
                button = ['Update filters']
                modal = ['filter']
                break
            case 'error':
                info = 'An unexpected error has occured. Please try to use another keyword.'
                button = ['Select another dataset']
                error = this.props.items.map((item, index) => <li key={index}>{item}</li>)
                break
            default:
                break
        }

        return (
            <div className="empty">
                <h3>{info}</h3>
                {
                    !isEmpty(error) ?
                        <ul>
                            {error}
                        </ul>
                        :
                        null
                }
                {
                    !isEmpty(button) ?
                        button.map((item, index) =>
                            <button
                                key={index}
                                type="button"
                                className="btn"
                                onClick={() => this.onButtonClick(modal[index]) }>
                                {item}
                                </button>
                        )
                        : null
                }
            </div>
        );
    }
}

Message.propTypes = {
    actions: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    items: PropTypes.array
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({setModal}, dispatch)
    };
}


export default connect(
    null,
    mapDispatchToProps
)(Message);