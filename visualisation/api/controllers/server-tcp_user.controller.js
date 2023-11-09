const errors = require('../errors_messages');
const services = require('../services/server-tcp_user.service');

const createUser = async (req, res) => {
    const user = req.body;
    await services.createUser(user, (error, result) => {
        if (error === errors.already_registered) {
            return res.status(449).send({ success: 1, data: error });
        }
        else if (error) {
            return res.status(500).send({ success: 1, data: error });
        }
        return res.status(200).send({ success: 0, data: result });
    });
}

const addResult = async (req, res) =>{
    const user = req.body.user;
    const result = req.body.result;

    await services.addResult(result, user, (error, result) => {
        if (error === errors.already_registered) {
            return res.status(449).send({ success: 1, data: error });
        }
        else if (error) {
            return res.status(500).send({ success: 1, data: error });
        }
        return res.status(200).send({ success: 0, data: result });
    });
}

module.exports = {
    createUser,
    addResult
};
