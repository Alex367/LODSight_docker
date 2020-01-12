import {SET_GRAPH_PARAMS} from '../constants/types'

import formatGraphParams from '../utils/formatGraphParams'

export function setGraphParams(data, fromUrl = false) {
    return {
        type: SET_GRAPH_PARAMS,
        payload: formatGraphParams(data, fromUrl)
    };
}