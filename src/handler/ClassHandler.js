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

    // Preload in the background. This should hold any requests that make it
    // until we have initialised
    this.init( null, null, null );
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
        .catch( e => {
          console.error('Failed to import', t.h.require);
          process.exit(1);
        })
        .then( m => {
          // Allow us to use a method other than handle(a,b,c)
          const meth = t.h.handle ? t.h.handle : 'handle';

          // Name allows us to select the exported handler, defaults to 'default'
          const name = t.h.name ? t.h.name : 'default';

          // Create a new instance
          const i = new m[name](t.h,t.c);
          if (!i) {
            console.error(t.h.require + ' not instantiated');
            process.exit(1);
          }

          // Get the handle method
          const hd = m[name].prototype[meth];
          if ( !hd) {
            console.error(t.h.require+' ' + meth + ' not found');
            process.exit(1);
          }

          // Create the delegate to call the handler
          t.delegate = (a,b,c) => hd.call(i,a,b,c);

          // Remove the now unwanted config
          delete t.h;
          delete t.c;
        })
        .then( () => {
          // Now unlock, invoke any requests that made it before we initialised
          this.lock
            .unlock('x')
            .filter( d => d && d.req )
            .forEach( d => t.delegate( d.req, d.resp, d.next ) );

          // Remove the lock as now unwanted
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
