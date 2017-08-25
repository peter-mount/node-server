import yaml from 'js-yaml'
import fs from 'fs'

import SpdyServer from './SpdyServer'

/*
const express = require('express')
const path = require('path')
const app = express()
const logger = require('morgan')
const fs = require('fs')
const spdy = require('spdy')
*/

class Server {
  /*
   * config Path to config json
   */
  constructor( args ) {
    console.log( "Server " + args );

    // Parse config
    const config = yaml.safeLoad( fs.readFileSync( args.config, 'utf8' ) )

    console.log( JSON.stringify( config, undefined, 2 ) );

    // Take each server & initialise each one
    this.servers = config.servers.reduce( (a,b) => {
      var n = b.name ? b.name : (new Date().getTime() + '.' + Math.random() )
      switch( b.type ) {
        case 'spdy':
          a[n] = new SpdyServer( b );
          break;
        default:
          console.error( "Unsupported server type", server.type )
        break;
      }
      return a;
    }, {})


    console.log( JSON.stringify( this.servers, undefined, 2 ) );
  }
}

export default Server;
