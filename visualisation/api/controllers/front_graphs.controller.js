const services = require('../services/front_graphs.service');

const getIndividualData = async (req, res) => {
    const id_user = req.query.id_user;
    await services.getIndividualData(id_user, (error, result) => {
        if (error) {
            return res.status(400).send({ success: 0, data: error });
        }
        return res.status(200).send({ success: 1, data: result });
    });
}

const getReactAndExecTime = async (req, res) => {
    await services.getReactAndExecTime((error, result) => {
        if (error) {
            return res.status(500).send({ success: 0, data: error });
        }
        return res.status(200).send({ success: 1, data: result });
    });

}

const getAllStimulis = async (req, res) => {
    await services.getAllStimulis((error, results) => {
        if (error) {
            return res.status(500).send({ success: 0, data: error });
        }
        return res.status(200).send({ success: 1, data: results });
    });
}

const filterResultsGraph = async (req, res) => {
    const data = req.query.data;

    await services.filterResultsGraph(data, (error, results) => {
        if (error) {
            return res.status(500).send({ success: 0, data: error });
        }
        return res.status(200).send({ success: 1, data: results });
    });
}

module.exports = {
    getIndividualData,
    getReactAndExecTime,
    getAllStimulis,
    filterResultsGraph
}