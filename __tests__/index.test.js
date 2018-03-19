const SessionPlugin = require('../index.js');

jest.mock('koa-session');
jest.mock('echo-handler');

describe('general integration tests for co-koa-session-plugin', () => {
  const schemaCalled = [];
  let spy = [];
  let setCall = null;
  const $ = {
    env: {
      mongoose: {
        model: function (name, schema) {
          spy.push(name);
          spy.push(schema);
          return {
            remove ({ key }) {
              if (key !== 'throw') {
                return "session remove called";
              } else throw new Error('remove failed');
            },
            findOne ({ key }) {
              switch(key) {
                case 'throw':
                  throw new Error('get failed');
                case 'nothing found':
                  return undefined;
                default:
                  return { data: 'session get called' };
              }
            },
            findOneAndUpdate ({ key }, b, c) {
              if (key !== 'throw') {
                setCall = 'session set called';
              } else throw new Error('update failed');
            }
          }
        },
        Schema: function ( ...schema ) {
          Object.keys(schema[0]).reduce((it, key) => {
            it.push(key);
            return it;
          }, schemaCalled)

        }
      }
    }
  }
  console.log('here')
  let plugin = SessionPlugin({ keys: ['ref'] });
  let sessionMock = null;
  plugin($.env.mongoose).init({ use: session => {
    sessionMock = session.getSessionSpy();
  } }, $);

  test('schema successfully created', () => {
    expect(schemaCalled[0]).toBe('key');
    expect(schemaCalled[1]).toBe('data');
    expect(schemaCalled[2]).toBe('updatedAt');
  });

  plugin = SessionPlugin();
  plugin($.env.mongoose).init({ use: session => {
    sessionMock = session.getSessionSpy();
  } }, $);

  test('sessionMock get returns mock data via the mock above', async () => {
    const result = await sessionMock[0].get()
    expect(result).toBe('session get called');
  });

  test('sessionMock get throws invalidSessionException where necessary', async () => {
    const spy = [];
    const echoHandler = require('echo-handler');
    echoHandler.setEchoHandlerSpy(spy);
    await sessionMock[0].get('throw')
    expect(spy[0].error).toEqual({"message": "error", "name": "InvalidSessionException", "var1": "get", "var2": "get failed"});
  });

  test('sessionMock get returns empty object if falsish value returned', async () => {
    const result = await sessionMock[0].get('nothing found')
    expect(result).toEqual({});
  });

  test('sessionMock set returns mock data via the mock above', async () => {
    const result = await sessionMock[0].set(1, 'data out', 3, { changed: 1 })
    expect(result).toBe('data out');
    expect(setCall).toBe('session set called');
  });

  test('sessionMock set throws invalidSessionException where necessary', async () => {
    const spy = [];
    const echoHandler = require('echo-handler');
    echoHandler.setEchoHandlerSpy(spy);
    await sessionMock[0].set('throw', 1, 2, { changed: 1 })
    expect(spy[0].error).toEqual({"message": "error", "name": "InvalidSessionException", "var1": "set", "var2": "update failed"});
  });

  test('if neither changed nor rolling, db set transaction is ignored', async () => {
    const spy = [];
    const echoHandler = require('echo-handler');
    echoHandler.setEchoHandlerSpy(spy);
    await sessionMock[0].set('throw', 1, 2, { })
    expect(spy.length).toEqual(0);
  });

  test('sessionMock destroy returns mock data via the mock above', async () => {
    const result = await sessionMock[0].destroy()
    expect(result).toBe('session remove called');
  });

  test('sessionMock destroy throws invalidSessionException where necessary', async () => {
    const spy = [];
    const echoHandler = require('echo-handler');
    echoHandler.setEchoHandlerSpy(spy);
    await sessionMock[0].set('throw', 1, 2, { rolling: 1 })
    expect(spy[0].error).toEqual({"message": "error", "name": "InvalidSessionException", "var1": "set", "var2": "update failed"});
  });

  test('sessionMock destroy throws invalidSessionException where necessary', async () => {
    const spy = [];
    const echoHandler = require('echo-handler');
    echoHandler.setEchoHandlerSpy(spy);
    await sessionMock[0].destroy('throw')
    expect(spy[0].error).toEqual({"message": "error", "name": "InvalidSessionException", "var1": "destroy", "var2": "remove failed"});
  });
});
