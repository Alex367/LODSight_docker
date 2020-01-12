import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Tooltip, OverlayTrigger} from 'react-bootstrap'
import setModal from '../../actions/modalActions'

const classNames = require("classnames");

class Controls extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            settingsVisible: false
        }
    }

    onToggleSettings() {
        this.setState({settingsVisible: !this.state.settingsVisible});
    }

    onClickFilter() {
        this.props.actions.setModal({open: true, content: 'filter'});
    }

    onClickAnimate() {
        this.props.animate();
    }

    onClickPrefixes() {
        this.props.togglePrefixes();
    }

    onClickDimension() {
        this.props.toggleDimension();
    }

    onClickGroup() {
        this.props.toggleGroupLinks();
    }

    onClickFrequency() {
        this.props.toggleFrequency();
    }

    render() {

        const {isAnimated, isPrefixes, is3D, groupedLinks, showLinkFrequency} = this.props;

        const tooltips = [
            <Tooltip id="animation">
                <strong>{isAnimated ? "freeze layout" : "unfreeze layout"}</strong>
            </Tooltip>,
            <Tooltip id="prefixes">
                <strong>{isPrefixes ? "hide prefixes" : "show prefixes"}</strong>
            </Tooltip>,
            <Tooltip id="dimensions">
                <strong>{is3D ? "show in 2D" : "show in 3D"}</strong>
            </Tooltip>,
            <Tooltip id="settings">
                <strong>settings</strong>
            </Tooltip>,
            <Tooltip id="filter">
                <strong>filter</strong>
            </Tooltip>,
            <Tooltip id="links">
                <strong>{groupedLinks ? "split links" : "group links"}</strong>
            </Tooltip>,
            <Tooltip id="frequency">
                <strong>{showLinkFrequency ? "hide link frequency" : "show link frequency"}</strong>
            </Tooltip>
        ]

        return (
            <div className="side-controls">
                <div className="side-controls-inner">
                    <div className={classNames("more-settings", this.state.settingsVisible ? "open" : "")}>
                        <OverlayTrigger placement="left" overlay={tooltips[0]}>
                            <button className="button btn side-button-small"
                                    data-tip data-for="animation"
                                    onClick={() => this.onClickAnimate()}>
                                <FontAwesomeIcon icon={isAnimated ? "pause" : "play"}/>
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="left" overlay={tooltips[5]}>
                            <button className="button btn side-button-small"
                                    data-tip data-for="links"
                                    onClick={() => this.onClickGroup()}>
                                <FontAwesomeIcon icon={groupedLinks ? "expand" : "compress"}/>
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="left" overlay={tooltips[6]}>
                            <button className="button btn side-button-small"
                                    data-tip data-for="frequency"
                                    onClick={() => this.onClickFrequency()}>
                                {
                                    showLinkFrequency ?
                                        <span className="fa-layers fa-fw">
                                            <FontAwesomeIcon icon="slash"/>
                                            <FontAwesomeIcon icon="signature"/>
                                        </span>
                                        :
                                        <FontAwesomeIcon icon="signature"/>
                                }
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="left" overlay={tooltips[1]}>
                            <button className="button btn side-button-small"
                                    data-tip data-for="prefixes"
                                    onClick={() => this.onClickPrefixes()}>
                                <span>:</span>
                            </button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="left" overlay={tooltips[2]}>
                            <button className="button btn side-button-small"
                                    data-tip data-for="dimensions"
                                    onClick={() => this.onClickDimension()}>
                                <span>{is3D ? "2D" : "3D"}</span>
                            </button>
                        </OverlayTrigger>
                    </div>
                    <OverlayTrigger placement="left" overlay={tooltips[3]}>
                        <button className="button btn side-button-large"
                                data-tip data-for="settings"
                                onClick={() => this.onToggleSettings()}>
                            <FontAwesomeIcon icon="cogs" size="2x"/>
                        </button>
                    </OverlayTrigger>
                    <OverlayTrigger placement="left" overlay={tooltips[4]}>
                        <button className="button btn side-button-large"
                                data-tip data-for="filter"
                                onClick={() => this.onClickFilter()}>
                            <FontAwesomeIcon icon="filter" size="2x"/>
                        </button>
                    </OverlayTrigger>
                </div>
            </div>
        )
    }
}

Controls.propTypes = {
    actions: PropTypes.object.isRequired,
    animate: PropTypes.func.isRequired,
    togglePrefixes: PropTypes.func.isRequired,
    toggleDimension: PropTypes.func.isRequired,
    toggleGroupLinks: PropTypes.func.isRequired,
    toggleFrequency: PropTypes.func.isRequired,
    isAnimated: PropTypes.bool.isRequired,
    isPrefixes: PropTypes.bool.isRequired,
    is3D: PropTypes.bool.isRequired,
    groupedLinks: PropTypes.bool.isRequired,
    showLinkFrequency: PropTypes.bool.isRequired,
}


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setModal
        }, dispatch)
    };
}

export default connect(
    null,
    mapDispatchToProps
)(Controls);