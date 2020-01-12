import {SET_GRAPH_COLORS} from '../constants/types'
import {generateColors} from '../utils/ColorsGenerator'

export default function setGraphColors(data) {
    return {
        type: SET_GRAPH_COLORS,
        payload: generateColors(data)
    };
}