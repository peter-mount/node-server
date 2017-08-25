import express from 'express'
import path from 'path'
import logger from 'morgan'

import HandlerRepository from './handler/HandlerRepository'

class ServerBase {
  constructor( name, server, config ) {
    console.log( JSON.stringify( config.handlers, undefined, 2 ) )
    this.name = name
    this.server = server

    this.app = express()

    this.app.use(logger('dev'))

    // Add our handlers
    Object.keys(config.handlers)
      .map( n => config.handlers[n])
      // Restricted to handler
      .filter( h => !h.restrict || h.restrict.indexOf(this.name))
      .forEach( h => {
        // Resolve the handler
        const handler = HandlerRepository.resolve( h.type, h )

        // Resolve the method
        const method = h.method ? h.method : 'get'
        if(!method || !this.app[method]) {
          throw 'Unsupported method ' + h.method
        }

        // Allow string as a single pattern
        if( typeof h.pattern === 'string' ) {
          h.pattern = [h.pattern]
        }

        h.pattern.forEach( p => {
          console.log('Adding', method, p)
          this.app[method]( p, handler )
        })
      } )
  }

  start() {
    console.log( 'Starting', this.name, 'on port',this.server.port)
  }

  stop() {
    console.log( 'Stopping', this.name, 'on port',this.server.port)
  }
}

export default ServerBase
