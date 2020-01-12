import { SET_GRAPH_PARAMS } from '../constants/types'
import { graphParams } from '../constants/initialState'


export default (state = graphParams, action = {}) => {
    switch(action.type) {
        case SET_GRAPH_PARAMS:
            return Object.assign({}, action.payload);
        default: return state;
    }
}