'use strict';

var config = require('./config'),
	express = require('express'),
	http = require('http'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	path = require('path');

// create express app
var app = module.exports = express();

// keep reference to config
app.config = config;

// setup web server
app.server = http.createServer(app);

// setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
	console.log("mongoose ready :)");
});

// settings
app.disable('x-powered-by');
app.set('port', config.port);

// middleware
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride('X-HTTP-Method-Override'));

require('./models')(app, mongoose);
var logic = require('./logic');

app.get('/api/visit', logic.visit);
app.get('/api/reset', logic.reset);
app.post('/api/act', logic.act);
app.post('/api/innovate', logic.act);
app.get('/:id', logic.visitInnovation);
app.all(/^(?!\/api).*$/, function (req, res, next) {
	res.sendFile(require('path').join(__dirname, './public/index.html'));
});

app.server.listen(app.config.port, function () {
	console.log("App listening on port 8000");
});