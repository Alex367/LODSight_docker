import {SET_FILTERS} from '../constants/types'
import {filters} from '../constants/initialState'


export default (state = filters, action = {}) => {
    switch (action.type) {
        case SET_FILTERS:
            return Object.assign({}, action.payload);
        default:
            return state;
    }
}