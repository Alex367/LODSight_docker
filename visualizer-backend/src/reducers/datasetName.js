import { SET_DATASET_NAME } from '../constants/types'
import { defaultDatasetName } from '../constants/initialState'


export default (state = defaultDatasetName, action = {}) => {
    switch(action.type) {
        case SET_DATASET_NAME:
            return action.payload;
        default: return state;
    }
}