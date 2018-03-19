const echoHandler = require('echo-handler');
const stampit = require('stampit');

module.exports = stampit({
  props: {
    Session: null
  },
  init ({
    $,
    i18n = 'en',
    mongoose,
    expires,
    name
  }) {
    const echo = echoHandler.configure({
      factoryOverride: `${__dirname}/i18n/${i18n}.storeMessages.json`,
      logger: $.logger
    });

    const schema = {
      key: String,
      data: Object,
      updatedAt: {
        default: new Date(),
        expires: 86400, // 1 day
        type: Date
      }
    };

    const updatedAt = Object.assign({}, schema.updatedAt, expires);
    this.session = mongoose.model(name, new mongoose.Schema(Object.assign({}, schema, { updatedAt })));


    this.destroy = async function (key) {
      try {
        const { session } = this;
        return session.remove({ key });
      } catch (e) {
        echo.throw({ name: 'InvalidSessionException', message: 'error' }, 'destroy', e.message);
      }
    };

    this.get = async function (key) {
      try {
        const { session } = this;
        const { data } = await session.findOne({ key }) || { data: {} };
        return data;
      } catch (e) {
        echo.throw({ name: 'InvalidSessionException', message: 'error' }, 'get', e.message);
      }
    };

    this.set = async function (key, data, maxAge, { changed, rolling }) {
      try {
        if (changed || rolling) {
          const { session } = this;
          await session.findOneAndUpdate(
            { key },
            { key, data, updatedAt: new Date() },
            { upsert: true, safe: true });
        }
        return data;
      } catch (e) {
        echo.throw({ name: 'InvalidSessionException', message: 'error' }, 'set', e.message);
      }
    };
  }
});
