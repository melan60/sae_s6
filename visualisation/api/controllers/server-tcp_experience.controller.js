const errors = require('../errors_messages');
const services = require('../services/server-tcp_experience.service');

const createExperience = async (req, res) => {
    const experience = req.body.experience;

    await services.createExperience(experience, (error, result) => {
        if (error === errors.already_registered) {
            return res.status(449).send({ success: 0, data: error });
        }
        else if (error) {
            return res.status(500).send({ success: 0, data: error });
        }
        return res.status(200).send({ success: 1, data: result });
    });
}

module.exports = { createExperience };