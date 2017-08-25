import HTTPServer from './HTTPServer';
import HTTPSServer from './HTTPSServer';
import H2Server from './H2Server';

class ServerRepository {
  static servers = {
    http: (a, b,c)=> new HTTPServer(a,b,c),
    https: (a, b,c)=> new HTTPSServer(a,b,c),
    h2: (a, b, c) => new H2Server(a, b, c)
  }

  static resolve( n, s, c ) {
    const f = ServerRepository.servers[n];
    if (!f) {
      throw new Error( "Unsupported Server " + n );
    }
    return f(n,s,c);
  }
}

export default ServerRepository;
