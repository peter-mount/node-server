import Handler from './Handler';

/*
 * Will reject the request with a 404
 */
class RejectHandler extends Handler {

  handle( req, resp, next ) {
    console.log("reject");
    resp.status( 404 )
      .send('');
  }
}

export default RejectHandler;
