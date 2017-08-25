import StatusHandler from './StatusHandler';

const handlers = {
  status: c => new StatusHandler( c )
};

class HandlerRepository {
  static resolve( n, c ) {
    const f = handlers[n];
    if (!f) {
      throw new Error( "Unsupported Handler " + n );
    }
    return f(c).handle;
  }
}

export default HandlerRepository;
