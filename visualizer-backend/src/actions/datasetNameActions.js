import {SET_DATASET_NAME} from '../constants/types'

export default function setDatasetName(name) {
    return {
        type: SET_DATASET_NAME,
        payload: name
    };
}