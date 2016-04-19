'use strict';

exports = module.exports = function (app, mongoose) {

	require('./models/Page')(app, mongoose);
	require('./models/Innovation')(app, mongoose);
};