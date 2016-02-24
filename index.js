/**
 * @module authenticator
 * @description finds the user by the requestData token
 *              Adds the user in req.data.activeUser
 *              If user is not found, assigns 'null'
 * @version	1.2.1
 */
var Promise = require('es6-promise').Promise;
// var errorHandler = require('./errorHandler');

exports.authenticate = function(req, mongoose) {
	return new Promise(function(resolve) {
		// check if we have a token to search with
		if (req.requestData.token) {
			findById(mongoose, 'Session', req.requestData.token)
			.then(function(result) {
				if (result) {
					findById(mongoose, 'User', result.userId)
					.then(function(result) {
						if (result) {
							req.activeUser = result;
							resolve();
						} else {
							req.activeUser = 'null';
							resolve();
						}
					});
				} else {
					req.activeUser = 'null';
					resolve();
				}
			});
		} else {
			req.activeUser = 'null';
			resolve();
		}
	});
};

// custom findById that has no limitations on the data it can load
function findById(mongoose, schemaName, id) {
	return new Promise(function(resolve) {
		var Model = mongoose.model(schemaName);

		Model
		.findById(id)
		.exec(function(error, result) {
			if (error) {
				GLOBAL.log('internal server error', error);
				// errorHandler.error(req, res, 'INTERNAL_SERVER_ERROR');
			} else {
				resolve(result || 'notFound');
			}
		});
	});
}
