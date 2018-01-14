let echoHandlerSpy = [];

module.exports = {
  getEchoHandlerSpy () {
    return echoHandlerSpy;
  },
  setEchoHandlerSpy (arr) {
    echoHandlerSpy = arr;
  },
  configure () {
    return {
      'throw' (object, var1, var2) {
        echoHandlerSpy.push({ error: { ...object, var1, var2 } });
      }
    };
  }
};
