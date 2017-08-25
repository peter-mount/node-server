import HTTP from './HTTP';
import HTTPS from './HTTPS';
import H2 from './H2';

const servers = {
  http: (a, b,c)=> new HTTP(a,b,c),
  https: (a, b,c)=> new HTTPS(a,b,c),
  h2: (a, b, c) => new H2(a, b, c)
};

class ServerRepository {
  static resolve( n, s, c ) {
    const f = servers[s.type];
    if (!f) {
      throw new Error( "Unsupported Server " + s.type );
    }
    return f(n,s,c);
  }
}

export default ServerRepository;
