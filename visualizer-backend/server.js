const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
import {Root} from './src/containers/Root.js';

function handleRender(req, res) {
    const html = ReactDOMServer.renderToString(Root);

    fs.readFile('index.html', 'utf8', function (err, data) {
        if (err) throw err;

        const document = data.replace(/<div id="root"><\/div>/, `<div id="root">from server?</div>`);

        res.send(document);
    });
   }

const app = express();

// Serve built files with static files middleware
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// Serve requests with our handleRender function
app.get('*', handleRender);


// Start server
app.listen(3000);