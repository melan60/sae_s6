const errors = require("../common_variables");
const {User, Result} = require("../models/index_models");

const bcrypt = require("bcryptjs");

/**
 * function to create a user
 * @param {JSON} user
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const createUser = async (user, callback) => {
    User.findOne({email: user.email})
        .exec()
        .then((result) => {
            if (result) {
                return callback(errors.already_registered);
            }
            console.log(user.password);
            User.create({
                name: user.name,
                firstName: user.firstName,
                password: bcrypt.hashSync(user.password, 10),
                email: user.email,
                age: user.age,
                gender: user.gender,
                typeUser: user.typeUser,
                results: [],
            })
                .then((user_created) => {
                    return callback(null, user_created);
                })
                .catch((e) => {
                    console.log(e);
                    return callback(e);
                });
        })
        .catch((e) => {
            return callback(e);
        });
};

/**
 * function to add result
 * @param {JSON} result
 * @param {JSON} user
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const addResult = async (result, user, callback) => {
    Result.create({
        experience: result.experience,
        reactTime: result.reactTime,
        execTime: result.execTime,
        error: result.error,
    })
        .then((res) => {
            User.findOne({email: user.email})
                .exec()
                .then((u) => {
                    if (!u) {
                        return callback(errors.not_found);
                    }
                    u.results.push(res);
                    u.save();
                    return callback(null, res);
                });
        })
        .catch((e) => {
            return callback(e);
        });
};

/**
 * function to get all users
 * @returns {Promise<*>}
 */
const getAllUsers = async () => {
    try {
        return await User.find({}).exec();
    } catch (error) {
        console.error("Error in fetching all users:", error);
        throw new Error(`Error in getAllUsers service: ${error.message}`);
    }
}

/**
 * function to get all cobayes
 * @returns {Promise<*>}
 */
const getAllCobayes = async () => {
    try {
        return await User.find({typeUser: "cobaye"}).exec();
    } catch (error) {
        console.error("Error in fetching all cobayes:", error);
        throw new Error(`Error in getAllCobayes service: ${error.message}`);
    }
};

/**
 * function to delete all cobayes
 * @returns {Promise<*>}
 */
const deleteAllCobayes = async () => {
    try {
        return await User.deleteMany({typeUser: "cobaye"}).exec();
    } catch (error) {
        console.error("Error in deleting all cobayes:", error);
        throw new Error(`Error in deleteAllCobayes service: ${error.message}`);
    }
}

/**
 * function to delete all users
 * @returns {Promise<*>}
 */
const deleteAllUsers = async () => {
    try {
        return await User.deleteMany({}).exec();
    } catch (error) {
        console.error("Error in deleting all users:", error);
        throw new Error(`Error in deleteAllUsers service: ${error.message}`);
    }
}

/**
 * function to delete a user with a given id
 * @param {String} id
 * @returns {Promise<*>}
 */
const deleteUser = async (id) => {
    try {
        return await User.deleteOne({_id: id}).exec();
    } catch (error) {
        console.error("Error in deleting user:", error);
        throw new Error(`Error in deleteUser service: ${error.message}`);
    }
}


module.exports = {
    createUser,
    addResult,
    getAllCobayes,
    deleteAllCobayes,
    deleteAllUsers,
    getAllUsers,
    deleteUser
};
