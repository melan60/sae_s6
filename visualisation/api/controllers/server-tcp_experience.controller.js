const services = require('../services/server-tcp_experience.service');

const createExperience = async (req, res) => {
    const experience = req.body.experience;

    await services.createExperience(experience, (error, result) => {
        if (error) {
            return res.status(400).send({ success: 0, data: error });
        }
        return res.status(200).send({ success: 1, data: result });
    });
}

module.exports = { createExperience };