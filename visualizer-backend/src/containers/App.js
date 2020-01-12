require("babel-polyfill")
require('eventsource-polyfill')
import React from 'react'
import{BrowserRouter, HashRouter, Route, Switch} from 'react-router-dom'
import Index from '../components/routes/index'
import Main from '../components/routes/main'
import About from '../components/routes/about'
import Help from '../components/routes/help'

import axios from 'axios'

import {library} from '@fortawesome/fontawesome-svg-core'
import {faArrowCircleRight, faPlay, faPause, faFilter, faCogs, faArrowLeft, faSearch, faTimes, faCompress, faExpand, faSlash, faSignature} from '@fortawesome/free-solid-svg-icons'
library.add({faArrowCircleRight, faPlay, faPause, faFilter, faCogs, faArrowLeft, faSearch, faTimes, faCompress, faExpand, faSlash, faSignature})

class App extends React.Component {

    constructor(props) {
        super(props);
        axios.defaults.headers.common['Optional'] = "BBWdad6bGPRpveaBEyFu4EkqRUrm9ER88EtQVtEWb2bAWCPL";
    }

    render() {
        return process.env.NODE_ENV === 'production' ? (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' render={(props) => <Index/>}/>
                    <Route exact path='/application/:controls?' render={(props) => <Main/>}/>
                    <Route exact path='/about' render={(props) => <About/>}/>
                    <Route exact path='/help' render={(props) => <Help/>}/>
                </Switch>
            </BrowserRouter>
        ) : (
            <HashRouter>
                <Switch>
                    <Route exact path='/' render={(props) => <Index/>}/>
                    <Route exact path='/application/:controls?' render={(props) => <Main/>}/>
                    <Route exact path='/about' render={(props) => <About/>}/>
                    <Route exact path='/help' render={(props) => <Help/>}/>
                </Switch>
            </HashRouter>
        )
    }
}

export default App