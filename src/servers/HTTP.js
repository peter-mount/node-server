import ServerBase from './ServerBase';
import http from 'http';

class HTTPS extends ServerBase {

  createServer() {
    return http.createServer(this.app);
  }
}

export default HTTPS;
