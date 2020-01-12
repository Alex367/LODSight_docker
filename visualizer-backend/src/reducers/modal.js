import { SET_MODAL } from '../constants/types'
import { modal } from '../constants/initialState'


export default (state = modal, action = {}) => {
    switch(action.type) {
        case SET_MODAL:
            return Object.assign({}, state, action.payload);
        default: return state;
    }
}