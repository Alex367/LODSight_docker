import {SET_MODAL} from '../constants/types'

export default function setModal(data) {
    return {
        type: SET_MODAL,
        payload: data
    };
}