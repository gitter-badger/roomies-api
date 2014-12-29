var
  restify = require('restify'),
  conf    = require('./app'),
  models  = require('./models');

// ---------------- SERVER CONF ---------------- //

var app = restify.createServer({
  logging: true,
  name: conf.name,
  version: '1.0.0'
});

app.use(restify.bodyParser());

app.use(function(req, res, next){
  req.models = models;
  return next();
});

app.use(function(req, res, next) {
  res.setHeader('content-type', 'application/json');
  return next();
});

// ---------------- MONITORING ------------ //

var opbeat = require('opbeat')({
  logging: false,
  organizationId: process.env.OPBEAT_ORGANIZATION_ID,
  appId: process.env.OPBEAT_APP_ID,
  secretToken: process.env.OPBEAT_SECRET_TOKEN
});

// ---------------- HANLDERS ---------------- //

var miscHandler = require('./handlers/misc');
var roomyHandler = require('./handlers/roomy');

// ---------------- ROUTES ---------------- //

app.get('/api/docs', miscHandler.getDocumentation);
app.get('/api/conf', miscHandler.getConf);

app.get ('/api/roomies', roomyHandler.findAll);
app.post('/api/roomies', roomyHandler.createOne);
app.del ('/api/roomies', roomyHandler.deleteAll);
app.put ('/api/roomies', miscHandler.methodNotAllowed);

app.get ('/api/roomies/:uuid', roomyHandler.findOne);
app.put ('/api/roomies/:uuid', roomyHandler.updateOne);
app.del ('/api/roomies/:uuid', roomyHandler.deleteOne);
app.post('/api/roomies/:uuid', miscHandler.methodNotAllowed);

// ---------------- MISC ---------------- //

module.exports = app;