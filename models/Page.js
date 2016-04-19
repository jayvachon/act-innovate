'use strict';

exports = module.exports = function (app, mongoose) {

	var pageSchema = new mongoose.Schema({
		count: { type: Number, default: 0 },
		actCount: { type: Number, default: 0 },
		innovateCount: { type: Number, default: 0 },
		maxVisits: { type: Number, default: 100 }
	});
	app.db.model('Page', pageSchema);
};