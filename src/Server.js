import yaml from 'js-yaml';
import yamlinc from 'yaml-include';
import fs from 'fs';

// The supported server types
import H2Server from './H2Server';
const types = {
  h2: (a, b, c) => new H2Server(a, b, c)
};

/*
const express = require('express')
const path = require('path')
const app = express()
const logger = require('morgan')
const fs = require('fs')
const spdy = require('spdy')
*/
class UnsupportedServerType extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = 'UnsupportedServerType';
  }
}

class Server {

  /*
  * config Path to config json
  */
  constructor( args ) {
    // Parse config
    const config = yaml.safeLoad(
      fs.readFileSync( args.config, 'utf8' ),
      {
        schema: yamlinc.YAML_INCLUDE_SCHEMA
      } );

    // Cleanup the tree as we have intermediate '/' keys
    Object.keys(config)
      .filter( k => config[k]['/'] )
      .forEach( k => config[k]=config[k]['/'] );

    // Also flatten the handlers into a single array
    config.handlers = Object.keys(config.handlers)
      // Map to handlers
      .map( n => config.handlers[n] )
      // Filter out any files without a handlers entry
      .filter( n => n )
      // Now the inner element
      .map( h => h.handlers )
      // Filter out any files without a handlers entry
      .filter( n => n )
      // Reduce into a single array
      .reduce( (a,b) => a.concat(b), [] );

    //console.log( JSON.stringify( config.handlers, undefined, 2 ) );

    // Now configure each server
    this.servers = Object.keys(config.servers)
      .reduce( (servers,name) => {
        console.log("Configuring server",name);
        const server = config.servers[name];

        console.log( JSON.stringify( server, undefined, 2 ) );

        // Get an instance
        const f = types[server.type];
        if (!f) {
          throw new UnsupportedServerType( server.type );
        }
        servers[name] = f(name,server,config);

        return servers;
      }, {});
  }

  start() {
    Object.keys(this.servers)
      .map( n => this.servers[n] )
      .forEach( s => s.start() );
  }

  stop() {
    Object.keys(this.servers)
      .map( n => this.servers[n] )
      .forEach( s => s.stop() );
  }
}

export default Server;
