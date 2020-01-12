import axios from 'axios'
import {
    REQUEST_GRAPH,
    RECEIVE_GRAPH,
    ERROR_GRAPH
} from '../constants/types'
import  {fetchUrl} from '../constants/constants'
import setDatasetName from './datasetNameActions'
import setGraphColors from './graphColorsActions'

function requestGraph() {
    return {
        type: REQUEST_GRAPH
    };
}

export function receiveGraph(data, message = '') {
    return {
        type: RECEIVE_GRAPH,
        payload: data,
        message: message
    }
}

function failedGraph(data) {
    return {
        type: ERROR_GRAPH,
        errors: data
    }
}

function shouldFetchGraph(state) {
    const fetch = state.graph;
    if (!fetch) {
        return true
    } else if (fetch.isFetching) {
        return false
    } else {
        return true
    }
}

function doFetchGraph(data, request) {
    return dispatch => {
        dispatch(requestGraph());
        return axios.post(fetchUrl + request, data).then(res => {
            const response = res.data;
            if (response.data.success) {
                dispatch(setDatasetName(response.data.data.dataset || response.data.data.endpoint))
                dispatch(setGraphColors(response.data.data.namespaces))
                dispatch(receiveGraph(response.data.data, response.message))
            } else {
                dispatch(failedGraph([response.message]))
            }
        }).catch(err => {
            return dispatch(failedGraph(["Neočekávaná chyba"]))
        })
    }
}

function fetchGraph(type) {
    let request;
    switch (type) {
        case 'get':
            request = 'getGraph';
            break;
        default:
            request = 'getGraph';
    }
    return (dispatch, getState) => {
        const state = getState();
        if (shouldFetchGraph(state)) {
            return dispatch(doFetchGraph(state.graphParams, request))
        } else {
            return Promise.resolve()
        }
    }
}

export function getGraph(){
    return fetchGraph('get');
}