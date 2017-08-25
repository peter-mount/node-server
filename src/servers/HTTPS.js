import ServerBase from './ServerBase';
import fs from 'fs';
import https from 'https';

class HTTPS extends ServerBase {

  createServer() {
    // Read in the certs
    const opts = this.server.options;
    opts.key = fs.readFileSync( opts.key );
    opts.cert = fs.readFileSync( opts.cert );

    return https.createServer(opts,this.app);
  }
}

export default HTTPS;
