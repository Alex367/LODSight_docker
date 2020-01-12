import {
    REQUEST_GRAPH,
    RECEIVE_GRAPH,
    ERROR_GRAPH
} from '../constants/types'
import { initialFetchState } from '../constants/initialState'


export default (state = initialFetchState, action = {}) => {
    switch(action.type) {
        case REQUEST_GRAPH:
            return Object.assign({}, state, {
                isFetching: true,
                message: '',
                errors: []
            })
        case RECEIVE_GRAPH:
            return Object.assign({}, state, {
                isFetching: false,
                items: action.payload,
                message: action.message
            })
        case ERROR_GRAPH:
            return Object.assign({}, state, {
                isFetching: false,
                errors: action.errors
            })
        default: return state;
    }
}