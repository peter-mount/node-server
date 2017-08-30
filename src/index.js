import Server from './Server';

// process.env.SERVER_ETC is set in the docker image
const cd = process.env.SERVER_ETC ? process.env.SERVER_ETC : 'etc';
process.chdir( cd );

new Server( {
  config: 'server.yaml'
} );
