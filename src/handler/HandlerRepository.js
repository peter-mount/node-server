import StatusHandler from './StatusHandler'

class HandlerRepository {
  static handlers = {
    status: c => new StatusHandler( c )
  }

  static resolve( n, c ) {
    const f = HandlerRepository.handlers[n]
    if(!f) {
      throw new "Unsupported Handler " + n
    }
    return f(c).handle
    //const h = f(c)
    //return (res, rep, next) => h.handle(res, rep, next)
  }
}

export default HandlerRepository
