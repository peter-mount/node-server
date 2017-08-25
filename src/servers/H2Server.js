import ServerBase from './ServerBase';
import fs from 'fs';
import spdy from 'spdy';

class H2Server extends ServerBase {

  start() {
    super.start();

    const opts = this.server.options;

    console.log(__dirname);
    opts.key = fs.readFileSync( opts.key );
    opts.cert = fs.readFileSync( opts.cert );

    this.srv = spdy.createServer(opts, this.app)
      .listen(this.server.port, (error) => {
        if (error) {
          console.error(error);
          return process.exit(1);
        } else {
          console.log('Listening on port: ' + this.server.port + '.');
        }
      });
  }
}

export default H2Server;
