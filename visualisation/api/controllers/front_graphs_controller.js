const services = require('../services/front_graphs_service');

/**
 * Function used to get individual data
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getIndividualData = async (req, res) => {
    const id_user = req.params.id;
    await services.getIndividualData(id_user, (error, result) => {
        if (error) {
            return res.status(400).send({ success: 0, data: error });
        }
        return res.status(200).send({ success: 1, data: result });
    });
}

/**
 * Function used to get the reaction time and execution time
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getReactAndExecTime = async (req, res) => {
    try {
        const user_id = req.query.userId;
        await services.getReactAndExecTime(user_id, (error, results) => {
            if (error) {
                return res.status(500).send({success: 0, data: error});
            }
            return res.status(200).send({success: 1, data: results});
        });
    } catch (error) {
        return res.status(500).send({success: 0, data: error});
    }
}

/**
 * Function used to get all stimulis
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const getAllStimulis = async (req, res) => {
    await services.getAllStimulis((error, results) => {
        if (error) {
            return res.status(500).send({ success: 0, data: error });
        }
        return res.status(200).send({ success: 1, data: results });
    });
}

/**
 * Function used to filter results for the graph
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const filterResultsGraph = async (req, res) => {
    const data = req.query.type;

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