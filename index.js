const session = require('koa-session');
const stampit = require('stampit');

const SessionStore = require('./lib/SessionStore');

module.exports = function({
  name = 'Session',
  expires = 86400, // 1 day is the default
  keys = undefined
} = {}) {
  return function (mongoose) {
    return {
      init (app, $) {
        if (keys) app.keys = keys;
        app.use(
          session(
            { store: SessionStore({ $, name, expires, mongoose }) },
            app));
      }
    }
  }
};
