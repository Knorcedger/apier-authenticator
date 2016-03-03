var Promise = require('es6-promise').Promise;
var db = require('apier-database');
var reqlog = require('reqlog');

exports.authenticate = function(req) {
	return new Promise(function(resolve) {
		// check if we have a token to search with
		if (req.requestData.token) {
			findById('Session', req.requestData.token)
			.then(function(result) {
				if (result) {
					findById('User', result.userId)
					.then(function(result) {
						if (result) {
							req.activeUser = result;
							resolve();
						} else {
							req.activeUser = 'null';
							resolve();
						}
					}, function() {
						req.activeUser = 'null';
						resolve();
					});
				} else {
					req.activeUser = 'null';
					resolve();
				}
			}, function() {
				req.activeUser = 'null';
				resolve();
			});
		} else {
			req.activeUser = 'null';
			resolve();
		}
	});
};

/**
 * custom findById that has no limitations on the data it can load
 * @method findById
 * @param  {string} schemaName The schema to load
 * @param  {string} id         The Object id to search with
 * @return {Promise}           Just a promise :p
 */
function findById(schemaName, id) {
	return new Promise(function(resolve, reject) {
		var Model = db.mongoose.model(schemaName);

		Model
		.findById(id)
		.exec(function(error, result) {
			if (error) {
				reqlog.error('internal server error', error);
				reject(error);
			} else {
				resolve(result || 'notFound');
			}
		});
	});
}
