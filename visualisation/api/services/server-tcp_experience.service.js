const errors = require('../errors_messages');
const { Experience } = require('../models/index.models');
const { Module } = require('../models/index.models');

/**
 * function to create a experience
 * @param {JSON} experience
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const createExperience = async (experience, callback) => {

    Experience.findOne({ name: experience.name })
        .exec()
        .then(result => {

            if (result) {
                return callback(errors.already_registered);
            }

            Experience.create({
                name: experience.name,
                typeStimulus: experience.typeStimulus,
                distraction: experience.distraction,
                modules: experience.modules
            })
                .then(experience => {
                    return callback(null, experience);
                })
                .catch(e => {
                    return callback(e)
                });
        })
        .catch();
}

const createModule = async (module, callback)=>{
    Module.findOne({ name: module.name })
        .exec()
        .then(result => {

            if (result) {
                return callback(errors.already_registered);
            }

            Module.create({
                name: module.name,
                uc: module.uc,
                description: module.description,
            })
                .then(experience => {
                    return callback(null, experience);
                })
                .catch(e => {
                    return callback(e)
                });
        })
        .catch();
}

module.exports = {
    createExperience,
    createModule
}