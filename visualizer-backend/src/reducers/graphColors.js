import { SET_GRAPH_COLORS } from '../constants/types'
import { graphColors } from '../constants/initialState'


export default (state = graphColors, action = {}) => {
    switch(action.type) {
        case SET_GRAPH_COLORS:
            return Object.assign({}, state, action.payload);
        default: return state;
    }
}