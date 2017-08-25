import ServerBase from './ServerBase';
import http from 'http';

class HTTPS extends ServerBase {

  start() {
    super.start();

    this.app.set('port', this.server.port);

    this.srv = http.createServer(this.app)
      .listen(this.server.port)
      .on('error', e => this.onError(e))
      .on('listening', () => this.onListening());
  }
}

export default HTTPS;
