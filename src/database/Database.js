import promise from 'native-promise';
import pgPromise from 'pg-promise';

const options = {
  // Initialization Options
  promiseLib: promise,
  // global event notification;
  error: function (error, e) {
    if (e.cn) {
      // A connection-related error;
      //
      // Connections are reported back with the password hashed,
      // for safe errors logging, without exposing passwords.
      console.log("CN:", e.cn);
      console.log("EVENT:", error.message || error);
    }
  }
};

const pgp = pgPromise( options );

const database = {};

class Database {
  static register( conf ) {
    Object.keys( conf )
      .forEach( n => {
        if ( database[n] ) {
          throw new Error( "Database "+n+" already defined" );
        }

        console.log( "Registering database", n );

        const c = conf[n];

        const co = {
          host: c.host,
          port: c.port ? c.port : 5432,
          database: c.database,
          user: c.user,
          password: c.password,
          ssl: c.ssl ? c.ssl : false
        };

        database[n] = pgp(co);
      } );
  }

  static get( n ) {
    return database[n];
  }
}

export default Database;
