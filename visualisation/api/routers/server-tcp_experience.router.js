const express = require('express');
const controller = require('../controllers/server-tcp_experience.controller');
const router = express.Router();

/**
 *  @swagger
 *  /experience/add:
 *    post:
 *      tags:
 *        - Experience
 *      description: Create a new experience with the specified properties.
 *      parameters:
 *        - in: body
 *          name: experience
 *          description: The experience to create.
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - typeStimulus
 *              - distraction
 *              - modules
 *            properties:
 *              name:
 *                type: string
 *              typeStimulus:
 *                type: string
 *              distraction:
 *                type: string
 *            example:
 *              experience:
 *                name: Vitesse de la lumière
 *                typeStimulus: Visuel
 *                distraction: Sonore (musique)
 *      responses:
 *        '200':
 *          description: Experience created succeffuly
 *        '449':
 *          description: Experience is already registered
 *        '500':
 *          description: Internal server error
 */
router.post("/add", controller.createExperience);

module.exports = router;