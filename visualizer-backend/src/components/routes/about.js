import React from 'react'
import Navigation from '../Common/Navigation'

class About extends React.Component {

    render() {
        return (
            <div>
                <Navigation isIndex={false}/>
                <p>about</p>
            </div>
        );
    }
}

export default About;