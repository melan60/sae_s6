const express = require('express');
const controller = require('../controllers/front_graphs.controller');
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *      description: Get results for one people
 *      tags:
 *          - GRAPHS
 *      parameters:
 *          - in: query
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
router.get("/users", controller.getIndividualData);

/**
 * @swagger
 * /time:
 *   get:
 *      description: Get react and exec time depends on age and gender
 *      tags:
 *          - GRAPHS
 *      responses:
 *          '200':
 *              description: Results gotten successfully
 *          '500':
 *              description: Internal server error
 */
router.get("/time", controller.getReactAndExecTime);

module.exports = router;