import StatusHandler from './StatusHandler';

class HandlerRepository {
  static handlers = {
    status: c => new StatusHandler( c )
  }

  static resolve( n, c ) {
    const f = HandlerRepository.handlers[n];
    console.log(n,f);
    if (!f) {
      throw new Error( "Unsupported Handler " + n );
    }
    return f(c).handle;
  }
}

export default HandlerRepository;
