import Handler from './Handler'

class StatusHandler extends Handler {
  constructor( props ) {
  super(props);
  }

  handle( req, resp, next ) {
    console.log("Status")
    resp.status(200)
    .json({
      code: 200,
      text: 'OK'
    })
  }
}

export default StatusHandler
