import Server from './Server';

// process.env.SERVER_ETC is set in the docker image
const cd = process.env.SERVER_ETC ? process.env.SERVER_ETC : 'etc';
process.chdir( cd );

const server = new Server( {
  config: 'server.yaml'
} );

try {
  server.start();
} catch (e) {
  console.error(e);
  server.stop();
  throw e;
}
