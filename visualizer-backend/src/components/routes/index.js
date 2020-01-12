import React from 'react'
import PropTypes from 'prop-types'

class Index extends React.Component {

    constructor(props, context){
        super(props);
        context.router.history.push('/application/');
    }

    render() {
        return (null)
    }
}

Index.contextTypes = {
    router: PropTypes.object.isRequired
}

export default Index;