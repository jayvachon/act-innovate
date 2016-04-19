'use strict';

var app = angular.module('act-innovate', []);

app.controller('MainController', ["$scope", "$document", "$http", function($scope, $document, $http) {

	// -- set the sea level

	var seaLevel = 0;
	var seaLevelRange = {
		"earth-width": [90, 0],
		"earth-top": [ -40, 80],
		"water": [ 40, 15]
	};

	var lerp = function (value1, value2, amount) {
		amount = amount < 0 ? 0 : amount;
		amount = amount > 1 ? 1 : amount;
		return value1 + (value2 - value1) * amount;
	}

	var getSeaLevelValue = function (id) {
		return lerp (seaLevelRange[id][0], seaLevelRange[id][1], seaLevel);
	}

	$http.get('/api/visit')
		.success(function(data) {
			seaLevel = data.count / data.maxVisits;
		})
		.error(function(err) {
			console.log("error: " + err);
		});

	$scope.style = function(id) {
		if (id == "earth")
			return { 
				"width": getSeaLevelValue("earth-width") + "%",
				"margin-top": getSeaLevelValue("earth-top") + "px"
			};
		if (id == "sky")
			return { 
				"height": getSeaLevelValue("water") + "%"
			};
	}

	// -- handle form submission

	var that = this;
	var optionSelected = null;

	this.act = function () {
		$http.post('/api/act')
			.success(function(data) {
				console.log(data);
				that.optionSelected = 'act';
			})
			.error(function(err) {
				console.log("error: " + err);
			});
	};

	this.innovate = function () {
		$http.post('/api/innovate')
			.success(function(data) {
				$scope.innovateLink = data._id;
				console.log(data._id);
				that.optionSelected = 'innovate';
			})
			.error(function(err) {
				console.log("error: " + err);
			});
	}
}]);
