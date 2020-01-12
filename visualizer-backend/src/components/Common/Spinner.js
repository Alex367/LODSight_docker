import React from 'react'

class Spinner extends React.Component {
    render() {
        return (
            <div className="spinner">
                <div className="blob blob-0"></div>
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
                <div className="blob blob-4"></div>
                <div className="blob blob-5"></div>
            </div>
        );
    }
}

export default Spinner