import axios from 'axios'
import {
    REQUEST_DATASETS,
    RECEIVE_DATASETS,
    ERROR_DATASETS,
    SET_SELECTED_DATASETS
} from '../constants/types'
import  {fetchUrl} from '../constants/constants'
import isEmpty from 'lodash/isEmpty'

export function setSelectedDatasets(data) {
    return {
        type: SET_SELECTED_DATASETS,
        payload: data
    };
}

function requestDatasets() {
    return {
        type: REQUEST_DATASETS
    };
}

export function receiveDatasets(data, message = '') {
    return {
        type: RECEIVE_DATASETS,
        payload: data,
        message: message
    }
}

function failedDatasets(data) {
    return {
        type: ERROR_DATASETS,
        errors: data
    }
}

function shouldFetchDatasets(state) {
    const fetch = state.datasets;
    if (!fetch) {
        return true
    } else if (fetch.isFetching) {
        return false
    } else if (!isEmpty(fetch.items.data)) {
        return false
    } else {
        return true
    }
}

function doFetchDatasets(data, request) {
    return dispatch => {
        dispatch(requestDatasets());
        return axios.post(fetchUrl + request, data).then(res => {
            const response = res.data;
            if (response.data.success) {
                dispatch(receiveDatasets(response.data.data, response.message))
            } else {
                dispatch(failedDatasets([response.message]))
            }
        }).catch(err => {
            return dispatch(failedDatasets(["Neočekávaná chyba"]))
        })
    }
}

function fetchDatasets(type, data) {
    let request;
    switch (type) {
        case 'get':
            request = 'getDatasets';
            break;
        default:
            request = 'getDatasets';
    }
    return (dispatch, getState) => {
        const state = getState();
        if (shouldFetchDatasets(state)) {
            return dispatch(doFetchDatasets(data, request))
        } else {
            return Promise.resolve()
        }
    }
}

export function getDatasets(data = {}){
    return fetchDatasets('get', data);
}