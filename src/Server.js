import yaml from 'js-yaml';
import yamlinc from 'yaml-include';
import fs from 'fs';

import Database from './database/Database';
import ServerRepository from './servers/ServerRepository';

class Server {

  /*
  * config Path to config json
  */
  constructor( args ) {

    // Parse and show banner
    const pack = JSON.parse( fs.readFileSync( __dirname + '/package.json', 'utf8' ) );
    console.log(pack.name,'version',pack.version);

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

    // Look for any database entries within handlers
    Database.register( Object.keys(config.handlers)
      .map( n => config.handlers[n] )
      .map( h => h.databases )
      .filter( n => n )
      .reduce( (a,b) => Object.assign( a, b ), {} )
    );

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

    // Now configure each server
    this.servers = Object.keys(config.servers)
      .reduce( (servers,name) => {
        servers[name] = ServerRepository.resolve(name, config.servers[name], config);
        return servers;
      }, {});

    // Now start the servers
    var p = Object.keys(this.servers)
      .map( n => this.servers[n] )
      .reduce(
        (p,s) => s.start( p ),
        new Promise( (res,rej) => res() )
      );

    // Last thing, log an error if the promise is rejected
    p.then( () => {}, e => console.error("Rejected",e) );

    // Stops the process from exiting whilst promises are resolved
    setTimeout( () => {}, 1000);
  }

  stop() {
    Object.keys(this.servers)
      .map( n => this.servers[n] )
      .forEach( s => s.stop() );
  }
}

export default Server;
