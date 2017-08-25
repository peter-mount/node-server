import H2Server from './H2Server';

class ServerRepository {
  static servers = {
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
