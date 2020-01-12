import {combineReducers} from 'redux'

import datasetName from './datasetName'
import graphParams from './graphParams'
import graph from './graph'
import {fetchDatasets, setSelectedDatasets} from './datasets'
import modal from './modal'
import filters from './filters'
import detail from './detail'
import graphColors from './graphColors'

const rootReducer = combineReducers({
    datasetName,
    graphParams,
    graph,
    datasets: fetchDatasets,
    selectedDatasets: setSelectedDatasets,
    modal,
    filters,
    detail,
    graphColors
});

export default rootReducer;