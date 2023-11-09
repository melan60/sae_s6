const errors = require('../common_variables');
const { Experience } = require('../models/index.models');

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

module.exports = { createExperience }