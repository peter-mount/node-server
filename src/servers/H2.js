import ServerBase from './ServerBase';
import fs from 'fs';
import spdy from 'spdy';

class H2 extends ServerBase {

  start() {
    super.start();

    // Read in the certs
    const opts = this.server.options;
    opts.key = fs.readFileSync( opts.key );
    opts.cert = fs.readFileSync( opts.cert );

    this.srv = spdy.createServer(opts, this.app)
      .listen(this.server.port)
      .on('error', e => this.onError(e))
      .on('listening', () => this.onListening());
  }
}

export default H2;
