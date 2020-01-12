import {
    REQUEST_DATASETS,
    RECEIVE_DATASETS,
    ERROR_DATASETS,
    SET_SELECTED_DATASETS
} from '../constants/types'
import {initialFetchState, selectedDatasets} from '../constants/initialState'

export function fetchDatasets(state = initialFetchState, action = {}){
    switch (action.type) {
        case REQUEST_DATASETS:
            return Object.assign({}, state, {
                isFetching: true,
                message: '',
                errors: []
            })
        case RECEIVE_DATASETS:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.payload,
                message: action.message
            })
        case ERROR_DATASETS:
            return Object.assign({}, state, {
                isFetching: false,
                errors: action.errors
            })
        default:
            return state;
    }
}

export function setSelectedDatasets(state = selectedDatasets, action = {}){
    switch (action.type) {
        case SET_SELECTED_DATASETS:
            return action.payload
        default:
            return state;
    }
}