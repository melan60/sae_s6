const errors = require('../common_variables');
const { Experience, Module } = require('../models/index_models');

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
                    return callback(e);
                });
        })
        .catch(e => {
            return callback(e);
        });
}

/**
 * function to create module
 * @param {JSON} module - Characteristic of the module to create
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const createModule = async (module, callback) => {
    Module.findOne({ name: module.name })
        .exec()
        .then(moduleFound => {
            if (moduleFound) {
                return callback(errors.already_registered);
            }

            Module.create({
                name: module.name,
                uc: module.uc,
                description: module.description
            })
                .then(moduleCreated => {
                    return callback(null, moduleCreated);
                })
                .catch(e => {
                    return callback(e)
                });
        });
}

/**
 * function to add module to an experience
 * @param {String} name_module - The name of the module to add
 * @param {String} name_experience - The relevant experience
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const addModuleToAnExperience = async (name_module, name_experience, callback) => {
    const module = await Module.findOne({ name: name_module }).exec();
    if (!module) {
        return callback(errors.not_found);
    }

    const experience = await Experience.findOne({ name: name_experience }).exec(); // findOneAndUpdate

    if (experience !== null &&
        experience.modules.filter(moduleId => moduleId.equals(module._id)).length > 0) {
        return callback(errors.already_registered);
    }

    experience.modules.push(module._id);
    experience.save();
    return callback(null, experience.modules);
}

module.exports = {
    createExperience,
    createModule,
    addModuleToAnExperience
}