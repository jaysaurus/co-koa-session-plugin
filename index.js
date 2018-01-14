const session = require('koa-session');
const stampit = require('stampit');

const SessionStore = require('./lib/SessionStore');

module.exports = stampit({
  init ({
    name = 'Session',
    expires = 86400 // 1 day is the default
  }) {
    Object.assign(this, {
      init (app, $) {
        app.use(
          session(
            { store: SessionStore({ $, name, expires, mongoose: $.env.mongoose }) },
            app));
      }
    });
  }
});
