const services = require('../services/front_graphs.service');

const getIndividualData = async (req, res) => {
    const id_user = req.query.id_user;
    await services.getIndividualData(id_user, (error, res) => {
        if (error) {
            return res.status(400).send({ success: 0, data: error })
        }
        return res.status(200).send({ success: 1, data: res })
    });
}

const getReactAndExecTime = async(req, res) => {
    await services.getReactAndExecTime((error, res) => {
        if (error) {
            return res.status(500).send({ success: 0, data: error })
        }
        return res.status(200).send({ success: 1, data: res })
    });

}

module.exports = {
    getIndividualData,
    getReactAndExecTime
}