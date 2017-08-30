import RejectHandler from './RejectHandler';
import Status from 'area51-status';

//import StatusHandler from './StatusHandler';

const handlers = {
  reject: (h, c) => new RejectHandler( h, c ),
  status: (h, c) => new Status()
};

class HandlerRepository {
  static resolve( n, c, config ) {
    const f = handlers[n];
    if (!f) {
      throw new Error( "Unsupported Handler " + n );
    }
    
    const h = f(c, config);
    return (a,b,c) => h.handle(a,b,c);
  }
}

export default HandlerRepository;
