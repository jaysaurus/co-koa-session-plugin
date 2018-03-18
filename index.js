const session = require('koa-session');
const stampit = require('stampit');

const SessionStore = require('./lib/SessionStore');

module.exports = stampit({
  init ({
    keys = null,
    name = 'Session',
    expires = 86400 // 1 day is the default
  }) {
    this.init = function (app, $) {
      if (keys) app.keys = keys;
      app.use(
        session(
          { store: SessionStore({ $, name, expires, mongoose: $.env.mongoose }) },
          app));
    }
  }
});
