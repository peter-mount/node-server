import RejectHandler from './RejectHandler';
import Status from 'area51-status';

//import StatusHandler from './StatusHandler';

const handlers = {
  reject: c => new RejectHandler( c ),
  status: c => new Status()
};

class HandlerRepository {
  static resolve( n, c ) {
    const f = handlers[n];
    if (!f) {
      throw new Error( "Unsupported Handler " + n );
    }
    return (a,b,c) => f(c).handle(a,b,c);
  }
}

export default HandlerRepository;
