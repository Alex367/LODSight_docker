import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import PropTypes from 'prop-types'
import {Navbar, Nav, NavItem} from 'react-bootstrap'

import setModal from '../../actions/modalActions'

class Navigation extends React.Component {

    onSelectClick() {
        this.props.actions.setModal({open: true, content: 'datasets'});
    }

    render() {
        const controls = this.context.router.route.match.params.controls;
        if (controls == 'false') {
            return null;
        }
        let heading = null;
        let home = null;
        switch (this.context.router.route.match.path) {
            case '/about':
                heading = 'About'
                home = <NavItem href="/application/">
                    application
                </NavItem>
                break;
            case '/help':
                heading = 'Help'
                home = <NavItem href="/application/">
                    application
                </NavItem>
                break;
            default:
                heading = this.props.datasetName
                home = <NavItem href="#" onClick={() => this.onSelectClick()}>
                    select dataset
                </NavItem>
        }
        return (
            <Navbar fluid fixedTop>
                <Navbar.Header>
                    <span className="page-name" title={heading}>{heading}</span>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        {home}
                        <NavItem href="/about">
                            about
                        </NavItem>
                        <NavItem href="/help">
                            help
                        </NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

Navigation.contextTypes = {
    router: PropTypes.object.isRequired,
}

Navigation.propTypes = {
    datasetName: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
    return {
        datasetName: state.datasetName
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({setModal}, dispatch)
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Navigation);