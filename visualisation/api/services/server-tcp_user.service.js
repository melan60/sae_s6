const { User } = require('../models/index.models');

/**
 * function to create a user
 * @param {JSON} user
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const createUser = async (user, callback) => {
    User.create({
        name: user.name,
        firstName: user.firstName,
        password: user.password,
        email: user.email,
        age: user.age,
        gender: user.gender,
        typeUser: user.typeUser,
        results: []
    })
        .exec()
        .then(user => {
            callback(null, user);
        })
        .catch(e => {
            callback(e)
        }); // TODO message err ou juste e
}

module.exports = { createUser }