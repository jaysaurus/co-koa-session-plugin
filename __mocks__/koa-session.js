const sessionSpy = [];
const obj = {
  getSessionSpy () {
    return sessionSpy;
  }
};

module.exports = function (session) {
  sessionSpy.push(session.store);
  return obj;
};
