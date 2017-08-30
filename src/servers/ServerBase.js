import express from 'express';
import logger from 'morgan';

import HandlerRepository from '../handler/HandlerRepository';

class ServerBase {
  constructor( name, server, config ) {
    this.name = name;
    this.server = server;
    this.config = config;

    this.app = express();

    // Same as logger('dev') but prefix with server name
    if (server.logging) {
      this.app.use(logger( name + ' :method :url :status :response-time ms - :res[content-length]'));
    }

  }

  start(p) {
    const t = this;

    p.then( () => console.log( t.name + ': Configuring' ) );

    //console.log( JSON.stringify( config.handlers, undefined, 2 ) );

    // Add our handlers
    Object.keys(t.config.handlers)
      .map( n => t.config.handlers[n])
      // Restricted to handler
      .filter( h => !h.restrict || h.restrict.indexOf(t.name))
      .forEach( h => {
        p.then( () => HandlerRepository.resolve( h, t.config ) )
          .then( h => (a,b,c) => h.handle(a,b,c) )
          .then( handler => {
          // Resolve the method
            const method = h.method ? h.method : 'get';
            if (!method || !t.app[method]) {
              throw new Error( 'Unsupported method ' + h.method );
            }

            // Allow string as a single pattern
            if ( typeof h.pattern === 'string' ) {
              h.pattern = [h.pattern];
            }

            if (t.server.debug) {
              h.pattern.forEach( pat => {
                console.log(t.name + ': adding', method, pat);
                t.app[method]( pat, handler );
              });
            } else {
              h.pattern.forEach( p => t.app[method]( p, handler ) );
            }
          });
      } );

    // Enable static content
    if (t.server.static) {
      p = p.then( () => {
        t.app.use( express.static(
          t.server.static.startsWith('/')
            ? t.server.static
            : (__dirname + '/' + t.server.static)
        ));
      });
    }

    p.then( () => {
      console.log( t.name + ': Starting on port',t.server.port);

      t.app.set('port', t.server.port);

      t.srv = t.createServer()
        .listen(t.server.port)
        .on('error', e => t.onError(e))
        .on('listening', () => t.onListening());
    });

    return p;
  }

  createServer() {
    throw new Error("createServer() not implemented");
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
