import yaml from 'js-yaml';
import yamlinc from 'yaml-include';
import fs from 'fs';

import ServerRepository from './servers/ServerRepository';

class Server {

  /*
  * config Path to config json
  */
  constructor( args ) {

    // Parse and show banner
    const pack = JSON.parse( fs.readFileSync( __dirname + '/package.json', 'utf8' ) )
    console.log(pack.name,'version',pack.version)

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

    // Now configure each server
    this.servers = Object.keys(config.servers)
      .reduce( (servers,name) => {
        servers[name] = ServerRepository.resolve(name, config.servers[name], config);
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
