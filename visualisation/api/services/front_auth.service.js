const { User } = require('../models/index.models');

/**
 * function to get a user
 * @param {string} email
 * @param {string} password
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const connectToFront = async (email, password, callback) => {
    User.findOne({ email: email, password: password })
        .exec()
        .then(user => {
            return callback(null, user);
        })
        .catch(e => {
            return callback(e)
        }); // TODO message err ou juste e
}

module.exports = { connectToFront }