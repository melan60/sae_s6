const errors = require('../common_variables');
const { User } = require('../models/index.models');
const { Result } =require('../models/index.models');

const bcrypt = require("bcryptjs");

/**
 * function to create a user
 * @param {JSON} user
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const createUser = async (user, callback) => {

    User.findOne({ email: user.email })
        .exec()
        .then(result => {

            if (result) {
                return callback(errors.already_registered);
            }
            console.log(user.password)
            User.create({
                name: user.name,
                firstName: user.firstName,
                password: bcrypt.hashSync(user.password, 10),
                email: user.email,
                age: user.age,
                gender: user.gender,
                typeUser: user.typeUser,
                results: []
            })
                .then(user_created => {
                    return callback(null, user_created);
                })
                .catch(e => {
                    return callback(e)
                });
        })
        .catch(e => {
            return callback(e)
        });
}

/**
 * function to add result
 * @param {JSON} result
 * @param {JSON} user
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const addResult = async(result, user, callback)=>{

    Result.create({
        experience: result.experience,
        reactTime: result.reactTime,
        execTime: result.execTime
    })
        .then(res => {
            console.log("test1")
            console.log(user.results);
            user.results.push(res);
            //user.results = res;
            //user.results.append(res);
            //user.results.add(res);
            console.log(user.results);
            return callback(null, res);
        })
        .catch(e => {
            return callback(e)
        });
}

module.exports = {
    createUser,
    addResult
}