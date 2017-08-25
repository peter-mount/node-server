import Server from './Server'

// process.env.SERVER_ETC is set in the docker image
const server = new Server( {
  config: (process.env.SERVER_ETC ? process.env.SERVER_ETC : '.') + '/server.yaml'
} )
