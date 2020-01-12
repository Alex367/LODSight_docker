import React from 'react'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Tooltip, OverlayTrigger} from 'react-bootstrap'
const classNames = require("classnames");

class Search extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: props.searchValue,
            searchVisible: false
        }
    }

    onClickSearch() {
        this.props.search(this.state.search);
    }

    toggleSearch() {
        const searchVisible = this.state.searchVisible
        if(searchVisible){
            this.setState({searchVisible: false, search: ''}, () => this.onClickSearch())
        }else{
            this.setState({searchVisible: true})
        }
    }

    onChange(e) {
        this.setState({search: e.target.value})
    }

    render() {
        const tooltips = [
            <Tooltip id="search">
                <strong>search</strong>
            </Tooltip>,
            <Tooltip id="close">
                <strong>close</strong>
            </Tooltip>,
        ]

        const searchVisible = this.state.searchVisible

        return (
            <div className="search">
                <div className="search-inner">
                    <input
                        type="text"
                        className={classNames("form-control", searchVisible ? "active" : "")}
                        value={this.state.search}
                        placeholder="search"
                        onChange={(e) => this.onChange(e)}
                    />
                    <OverlayTrigger placement="left" overlay={tooltips[0]}>
                        <button className="button btn side-button-small"
                                data-tip data-for="search"
                                onClick={() => searchVisible ? this.onClickSearch() : this.toggleSearch()}>
                            <FontAwesomeIcon icon="search" size="1x"/>
                        </button>
                    </OverlayTrigger>
                    {
                        searchVisible ?
                            <OverlayTrigger placement="left" overlay={tooltips[1]}>
                                <button className="button btn close"
                                        data-tip data-for="close"
                                        onClick={() => this.toggleSearch()}>
                                    <FontAwesomeIcon icon="times" size="1x"/>
                                </button>
                            </OverlayTrigger>
                            : null
                    }

                </div>
            </div>
        )
    }
}

Search.propTypes = {
    search: PropTypes.func.isRequired,
    searchValue: PropTypes.string
}


export default Search