import HTTP from './HTTP';
import HTTPS from './HTTPS';
import H2 from './H2';

class ServerRepository {
  static servers = {
    http: (a, b,c)=> new HTTP(a,b,c),
    https: (a, b,c)=> new HTTPS(a,b,c),
    h2: (a, b, c) => new H2(a, b, c)
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
