'use strict';

var async = require('async');

var getPage = function (req, callback) {

	var page;

	var find = function(cb) {
		req.app.db.models.Page.find({}, function(err, pages) {
			page = pages[0];
			cb(null, 'done');
		});
	};

	var create = function(data, cb) {
		if (page != undefined)
			return cb(null, 'done');
		req.app.db.models.Page.create({}, function(err, newPage) {
			page = newPage;
			cb(null, 'done');
		});
	};

	var asyncFinally = function(err, result) {
		if (err)
			return next(err);
		callback(page);
	}

	async.waterfall([find, create], asyncFinally);
};

var incrementSea = function (req, callback) {

	var page;

	var findPage = function(cb) {
		getPage (req, function(pg) {
			page = pg;
			cb(null, 'done');
		});
	};

	var reset = function(data, cb) {
		if (page.count >= page.maxVisits) {
			page.update({ 'count': 0 }, function(err, n) {
				cb(null, 'done');
			});
		}
	};

	var iterate = function(data, cb) {
		page.update({ '$inc': { 'count': 1 } }, { upsert: true }, function(err, n) {
			cb(null, 'done');
		});
	};

	var asyncFinally = function(err, result) {
		if (err)
			return next(err);
		callback(page);
	};

	async.waterfall([findPage, iterate], asyncFinally);

};

var logic = {

	reset: function (req, res, next) {
		req.app.db.models.Page.remove({}, function(err, result) {
			res.status(200).json({ result: 'success' });
		});
	},

	visit: function (req, res, next) {

		incrementSea (req, function(page) {
			res.status(200).json(page);
		});
	},

	visitInnovation: function (req, res, next) {
		
		incrementSea (req, function(page) {
			res.status(200).json(page);
		});
	},

	act: function (req, res, next) {

		getPage(req, function(page) {
			page.update({ '$inc': { 'count': -1 } }, function(err, n) {
				res.status(200).json(page);
			});
		});
	},

	innovate: function (req, res, next) {
		req.app.db.models.Innovation.create({}, function(err, innovation) {
			res.status(200).json(innovation);
		});
	}
};

module.exports = logic;