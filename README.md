[![Build Status](https://travis-ci.org/jaysaurus/co-koa-session-plugin.svg?branch=master)](https://travis-ci.org/jaysaurus/co-koa-session-plugin)
[![Coverage Status](https://coveralls.io/repos/github/jaysaurus/co-koa-session-plugin/badge.svg?branch=master)](https://coveralls.io/github/jaysaurus/co-koa-session-plugin?branch=master) <a href="https://snyk.io/test/github/jaysaurus/co-koa-session-plugin?targetFile=package.json"><img src="https://snyk.io/test/github/jaysaurus/co-koa-session-plugin/badge.svg?targetFile=package.json" alt="Test for Vulnerabilities" data-canonical-src="https://snyk.io/test/github/jaysaurus/co-koa-session-plugin?targetFile=package.json" style="max-width:100%;"></a> [![Greenkeeper badge](https://badges.greenkeeper.io/jaysaurus/co-koa-session-plugin.svg)](https://greenkeeper.io/)


<a title="Co.Koa on github" href="https://jaysaurus.github.io/Co.Koa">
<img alt="Co.Koa header" title="Co.Koa" style="margin: 0 15%; width: 70%" src="https://raw.githubusercontent.com/jaysaurus/Co.Koa/master/siteStrapCoKoa.png?sanitize=true" />
</a>

# co-koa-session-plugin

### Warning, doesn't presently work with Co.Koa 1.5.0!

koa-session plugin with support for mongoose within the [Co.Koa MVC](http://cokoajs.com) environment.

This plugin (available in the [Co.Koa MVC](http://cokoajs.com) from version @0.17.0 onwards)  aims to consolidate [koa-session](https://npmjs/package/koa-session) and a modified implementation of [koa-session-mongoose](https://www.npmjs.com/package/koa-session-mongoose) into one easy-to-install plugin module; thereby enabling secure session management that is handled via a session collection in your MongoDB database.

## installation

add co-koa-session-plugin to a Co.Koa project instance via:

```
npm i co-koa-session-plugin --save
```

within your app.js add the co-koa-session-plugin as a requirement and pass the SessionPlugin call as below:

```javascript
const fs = require('fs');
const SessionPlugin = require('co-koa-session-plugin');

if (fs.existsSync('./node_modules')) {
  const CoKoa = require('co-koa-core');
  try {
    const coKoa = CoKoa(__dirname).launch(SessionPlugin()); // <= HERE!
    ...
```

The `SessionPlugin` can optionally be called with a configuration object.  The properties of this object are described below:

```javascript
const coKoa =
  CoKoa(__dirname).launch(
    SessionPlugin({
      keys: ... // (optional) supply a reference to an array of keys to be used by app.keys, will defer to Co.Koa's defaults if keys are not supplied.
      name: ... // the name of the collection (default is "Session")
      expires: ... // the amount of time in seconds until the session expires
    }));
```

## Use

In a controller, your session object is exposed as below:

```javascript
async 'GET /session' (ctx) {
  const { session } = ctx;
  let n = session.views || 0;
  session.views = ++n;
  ctx.body = `${n} view(s)`;
}
```

for more information on sessions, please see: [koa-session](https://npmjs/package/koa-session).

(thanks to @mjbondra for koa-session-mongoose)
