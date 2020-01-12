import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import Modal from 'react-responsive-modal';
import setModal from '../../actions/modalActions'
import DatasetPicker from './DatasetPicker'
import Filter from './Filter'

class ModalWrapper extends React.Component {

    onCloseModal() {
        this.closeModal();
    };

    closeModal() {
        this.props.actions.setModal({open: false});
    }

    render() {
        const {modal} = this.props;
        return (
            <div>
                <Modal open={modal.open} showCloseIcon={false} onClose={() => this.onCloseModal()} center classNames={{modal: "modal-lg"}}>
                    <div className="modal-content">
                        {modal.content == 'datasets' ?
                            <DatasetPicker/>
                        :
                            <Filter/>
                        }

                    </div>
                </Modal>
            </div>
        )
    }
}

ModalWrapper.propTypes = {
    actions: PropTypes.object.isRequired,
    modal: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        modal: state.modal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setModal
        }, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalWrapper);