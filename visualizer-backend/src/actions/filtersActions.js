import {SET_FILTERS} from '../constants/types'

export default function setFilters(data) {
    return {
        type: SET_FILTERS,
        payload: data
    };
}