import { SET_DETAIL } from '../constants/types'
import { detail } from '../constants/initialState'


export default (state = detail, action = {}) => {
    switch(action.type) {
        case SET_DETAIL:
            return action.payload;
        default: return state;
    }
}