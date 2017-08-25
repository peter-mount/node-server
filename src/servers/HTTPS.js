import ServerBase from './ServerBase';
import fs from 'fs';
import https from 'https';

class HTTPS extends ServerBase {

  start() {
    super.start();

    // Read in the certs
    const opts = this.server.options;
    opts.key = fs.readFileSync( opts.key );
    opts.cert = fs.readFileSync( opts.cert );

    this.app.set('port', this.server.port);

    this.srv = https.createServer(opts,this.app)
      .listen(this.server.port)
      .on('error', e => this.onError(e))
      .on('listening', () => this.onListening());
  }
}

export default HTTPS;
