import ApiLock from 'area51-apilock';
import Handler from './Handler';

/*
* A handler that will delegate to an external class which implements Handler.
*
* Note: the remote class does not need to extend Handler, just implement the
* handle method at a minimum.
*
* This method just implements the glue
*/
class ClassHandler extends Handler {

  constructor( h, c ) {
    super();
    this.h = h;
    this.c = c;
    this.delegate = null;

    this.lock = new ApiLock();
  }

  init( req, resp, next ) {
    const t = this;
    // Only run the load once, queue any other requests until it's done
    if (this.lock.lock('x',{
      req: req,
      resp: resp,
      next: next
    })) {
      import( t.h.require )
        .then( m => {
        // Allow us to use a method other than handle(a,b,c)
          const meth = t.h.handle ? t.h.handle : 'handle';

          const i = new m.default(t.h,t.c);
          if (!i) {
            throw new Error(t.h.require + ' not instantiated');
          }

          const hd = m.default.prototype[meth];
          if ( !hd) {
            throw new Error(t.h.require+' ' + meth + ' not found');
          }

          t.delegate = (a,b,c) => hd(a,b,c);

          delete t.h;
          delete t.c;
        })
        .then( () => {
          this.lock
            .unlock('x')
            .forEach( d => t.delegate( d.req, d.resp, d.next ) );
          delete this.lock;
        });
    }
  }

  handle( req, resp, next ) {
    if ( this.delegate === null ) {
      this.init(req,resp,next);
    } else {
      this.delegate(req,resp,next);
    }
  }
}

export default ClassHandler;
