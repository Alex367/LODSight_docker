//Dataset name
export const defaultDatasetName = 'No dataset selected'

//Graph colors
export const graphColors = []

//Graph params
export const graphParams = {}

//Modal visibility (content: datasets or filter)
export const modal = {
    open: false,
    content: "datasets"
}

//filters
export const filters = {
    selectedPredicates: [],
    selectedNamespaces: [],
    maxFrequency: 100,
    minFrequency: 1
}

//detail
export const detail = {}

//selected datasets
export const selectedDatasets = []

//Fetch state
export const initialFetchState = {
    items: [],
    isFetching: false,
    errors: [],
    message: ''
}