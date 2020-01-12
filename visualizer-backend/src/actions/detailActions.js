import {SET_DETAIL} from '../constants/types'

export default function setDetail(data) {
    return {
        type: SET_DETAIL,
        payload: data
    };
}