const errors = require('../errors_messages');
const services = require('../services/server-tcp_user.service');

const createUser = async (req, res) => {
    const user = req.body.user;

    await services.createUser(user, (error, result) => {
        if (error === errors.already_registered) {
            return res.status(449).send({ success: 0, data: error });
        }
        else if (error) {
            return res.status(500).send({ success: 0, data: error });
        }
        return res.status(200).send({ success: 1, data: result });
    });
}

module.exports = { createUser };