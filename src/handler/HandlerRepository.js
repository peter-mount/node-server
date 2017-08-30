import ClassHandler from './ClassHandler';
import RejectHandler from './RejectHandler';
import Status from 'area51-status';

const handlers = {
  class: (h, c) => new ClassHandler(h, c),
  reject: (h, c) => new RejectHandler(h, c),
  status: (h, c) => new Status()
};

class HandlerRepository {

  static resolve( h, c ) {
    const f = handlers[h.type];

    if (f) {
      return f(h, c);
    }

    throw new Error("Unsupported Handler " + h.type );
  }
}

export default HandlerRepository;
