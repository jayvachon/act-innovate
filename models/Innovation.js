'use strict';

exports = module.exports = function (app, mongoose) {

	var innovationSchema = new mongoose.Schema({
		count: { type: Number, default: 0 }
	});
	app.db.model('Innovation', innovationSchema);
};