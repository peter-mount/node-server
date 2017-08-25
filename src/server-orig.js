#!/usr/bin/env node
/*
* A basic express server for serving the site
*/

const express = require('express');
const path = require('path');
const app = express();
const logger = require('morgan');
const fs = require('fs');
const spdy = require('spdy');

const port = process.env.PORT || 3000;

app.use(logger('dev'));

// Disallow *.map files when using debugger, we don't deploy them but this
// returns an appropriate 404
app.get( '*.map', (req,resp) => resp.writeHead(404) );

// Now load our apps
const reactApps = JSON.parse( fs.readFileSync( __dirname + '/server.json' ) );
Object
  .keys(reactApps)
  .forEach( name => {
    console.log("Installing: " + name );
    const d = __dirname + '/public',
      p = '/'+name+'/';

    const handler = (request, response) => {

    // If spdy then push any resources first
      if (response.isSpdy) {
        reactApps[name]
          .forEach(
            n => response.push( n, {
              status: 200,
              method: 'GET',
              request: {
                accept: '*/*'
              },
              response: {
                //'content-type': 'application/javascript'
              }
            })
              .on('error', e => console.error(e) )
              .end( fs.readFileSync(
                path.resolve(__dirname, 'public', n.substr(1).split('?')[0] )
              ) )
          );
      }

      response.sendFile(
        path.resolve(__dirname, 'public', name, 'index.html')
      );

    };

    app.get( p , handler );
    app.get( p + 'index.html' , handler );

    // Now the js/css resources
    reactApps[name]
      .filter( n => n.startsWith(p))
      .forEach(
        n => app.get( n, (res,resp) => resp.sendFile( d + n ) )
      );

    // Finally the catch all for the app
    app.get( p + '*' , handler );
  } );

// serve static assets normally
app.use(express.static(__dirname + '/public'));

// Fire up the HTTP/2 server
const options = {
  // Letsencrypt keys
  key: fs.readFileSync(__dirname + '/privkey.pem'),
  cert:  fs.readFileSync(__dirname + '/fullchain.pem'),
  // spdy config
  spdy: {
    protocols: ['h2', 'spdy/4', 'spdy/3.1', 'spdy/3', 'spdy/2', 'http/1.1', 'http/1.0'],
    plain: false,
    'x-forwared-for': false,
    connection: {
      windowSize: 1024*1024,
      autoSpdy31: true
    }
  }
};
spdy
  .createServer(options, app)
  .listen(port, (error) => {
    if (error) {
      console.error(error);
      return process.exit(1);
    } else {
      console.log('Listening on port: ' + port + '.');
    }
  });

/*

    // CSS requested directly
    app.get( p + ".css" , (request, response) => {
      console.log(' css:' + [name, request.params[0] + '.css'].join('/'));
      response.sendFile(
        path.resolve(__dirname, 'public', name, request.params[0] + '.css' )
      )
    } )

    // JS requested directly
    app.get( p + ".js" , (request, response) => {
      console.log('  js:' + [name, request.params[0] + '.js'].join('/'));
      response.sendFile(
        path.resolve(__dirname, 'public', name, request.params[0] + '.js' )
      )
    } )
*/
