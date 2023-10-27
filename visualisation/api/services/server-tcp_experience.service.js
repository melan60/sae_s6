const { Experience } = require('../models/index.models');

/**
 * function to create a experience
 * @param {JSON} experience
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const createExperience = async (experience, callback) => {
    Experience.create({
        name: experience.name,
        typeStimulus: experience.typeStimulus,
        distraction: experience.distraction,
        modules: experience.modules
    })
        .exec()
        .then(experience => {
            callback(null, experience);
        })
        .catch(e => {
            callback(e)
        }); // TODO message err ou juste e
}

module.exports = { createExperience }