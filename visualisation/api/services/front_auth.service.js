const errors = require('../common_variables');
const { User } = require('../models/index.models');

const bcrypt = require("bcryptjs");

/**
 * function to get a user
 * @param {string} email
 * @param {string} password
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const connectToFront = async (email, password, callback) => {
    const password_crypted = bcrypt.hashSync(password);

    User.findOne({ email: email })
        .exec()
        .then(user => {

            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    return callback(null, user);
                } else {
                    return callback(errors.params_authentification);
                }
            })
        })
        .catch(e => {
            return callback(e)
        }); // TODO message err ou juste e
}

module.exports = { connectToFront }