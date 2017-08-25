import express from 'express';
import logger from 'morgan';

import HandlerRepository from '../handler/HandlerRepository';

class ServerBase {
  constructor( name, server, config ) {
    console.log(name+": configuring server");

    //console.log( JSON.stringify( config.handlers, undefined, 2 ) );

    this.name = name;
    this.server = server;

    this.app = express();

    this.app.use(logger('dev'));

    // Add our handlers
    Object.keys(config.handlers)
      .map( n => config.handlers[n])
    // Restricted to handler
      .filter( h => !h.restrict || h.restrict.indexOf(this.name))
      .forEach( h => {
      // Resolve the handler
        const handler = HandlerRepository.resolve( h.type, h );

        // Resolve the method
        const method = h.method ? h.method : 'get';
        if (!method || !this.app[method]) {
          throw new Error( 'Unsupported method ' + h.method );
        }

        // Allow string as a single pattern
        if ( typeof h.pattern === 'string' ) {
          h.pattern = [h.pattern];
        }

        h.pattern.forEach( p => {
          console.log(this.name + ': adding', method, p);
          this.app[method]( p, handler );
        });
      } );
  }

  start() {
    console.log( this.name + ': Starting on port',this.server.port);
  }

  stop() {
    console.log( this.name + ': Stopping on port',this.server.port);
  }

  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = (typeof this.server.port === 'string' ? 'Pipe ' : 'Port ') + this.server.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(this.name + ': ' + bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(this.name + ': ' + bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  onListening() {
    var addr = this.srv.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.log( this.name + ': Listening on ' + bind);
  }

}

export default ServerBase;
