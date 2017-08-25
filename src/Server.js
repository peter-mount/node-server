import yaml from 'js-yaml'
import fs from 'fs'

// The supported server types
import SpdyServer from './SpdyServer'
const types = {
  spdy: b => new SpdyServer( b )
}

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

    // Take each server & initialise each one
    this.servers = config.servers.reduce( (a,b) => {
      var f = types[b.type];
      if (f) {
        a[ b.name ? b.name : (new Date().getTime() + '.' + Math.random() ) ] = f(b);
      } else {
        console.error( "Unsupported server type", server.type )
      }
      return a;
    }, {})

    console.log( JSON.stringify( this.servers, undefined, 2 ) );
  }
}

export default Server;
