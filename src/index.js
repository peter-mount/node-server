import Server from './Server';

// process.env.SERVER_ETC is set in the docker image
const cd = process.env.SERVER_ETC ? process.env.SERVER_ETC : 'etc';
process.chdir( cd );

const server = new Server( {
  config: 'server.yaml'
} );

// On container shutdown exit quickly
process.on('SIGTERM', () => {
  server.stop();
  process.exit(0);
});
