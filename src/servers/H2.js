import ServerBase from './ServerBase';
import fs from 'fs';
import spdy from 'spdy';

class H2 extends ServerBase {

  createServer() {
    // Read in the certs
    const opts = this.server.options;
    opts.key = fs.readFileSync( opts.key );
    opts.cert = fs.readFileSync( opts.cert );

    return spdy.createServer(opts, this.app);
  }
  
}

export default H2;
