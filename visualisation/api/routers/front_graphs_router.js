const express = require('express');
const controller = require('../controllers/front_graphs_controller');
const router = express.Router();

/**
 * @swagger
 * /graphs/user/{id}:
 *   get:
 *      description: Get execution time, reaction time, number of errors for a given user
 *      tags:
 *          - GRAPHS
 *      parameters:
 *          - in: params
 *            name: id_user
 *            type: integer
 *            required: true
 *            description: ID of the user
 *      responses:
 *          '200':
 *              description: Results gotten successfully
 *          '400':
 *              description: Bad request
 */
router.get("/user/:id", controller.getIndividualData);

/**
 * @swagger
 * /graphs/time:
 *   get:
 *      description: Get react and execution time for all users
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
 *          name: type
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