const express = require('express');
const controller = require('../controllers/front_graphs.controller');
const router = express.Router();

/**
 * @swagger
 * /graphs/users:
 *   get:
 *      description: Get results for one people
 *      tags:
 *          - GRAPHS
 *      parameters:
 *          - in: query
 *            name: id_user
 *            type: string
 *            required: true
 *            description: ID of the user
 *      responses:
 *          '200':
 *              description: Results gotten successfully
 *          '400':
 *              description: Bad request
 */
router.get("/users", controller.getIndividualData);

/**
 * @swagger
 * /graphs/time:
 *   get:
 *      description: Get react and exec time for all users
 *      tags:
 *          - GRAPHS
 *      responses:
 *          '200':
 *              description: Results gotten successfully
 *          '500':
 *              description: Internal server error
 */
router.get("/time", controller.getReactAndExecTime);

/**
 * @swagger
 * /graphs/stimulis:
 *   get:
 *      description: Get all stimulis
 *      tags:
 *          - GRAPHS
 *      responses:
 *          '200':
 *              description: Results gotten successfully
 *          '500':
 *              description: Internal server error
 */
router.get("/stimulis", controller.getAllStimulis);

/**
 * @swagger
 * /graphs/filter:
 *   get:
 *      description: Filter according to type of stimulis selected
 *      tags:
 *          - GRAPHS
 *      parameters:
 *        - in: query
 *          name: data
 *          type: string
 *          required: true
 *          description: The type of stimuli to filter
 *          example:
 *            Visuel
 *      responses:
 *          '200':
 *              description: Results gotten successfully
 *          '500':
 *              description: Internal server error
 */
router.get("/filter", controller.filterResultsGraph);

module.exports = router;