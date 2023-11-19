const express = require("express");
const controller = require("../controllers/server-tcp_experience.controller");
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

/**
 *  @swagger
 *  /experience/module/add:
 *    post:
 *      tags:
 *        - Experience
 *      description: Create a new module with the specified properties.
 *      parameters:
 *        - in: body
 *          name: module
 *          description: The module to create.
 *          schema:
 *            type: object
 *            required:
 *              - name
 *              - uc
 *              - description
 *            properties:
 *              name:
 *                type: string
 *              uc:
 *                type: string
 *              description:
 *                type: string
 *            example:
 *              module:
 *                name: module n°2
 *                uc: esp8266
 *                description: Récolter les pulsasions cardiaques
 *      responses:
 *        '200':
 *          description: Module created succeffuly
 *        '449':
 *          description: Module is already registered
 *        '500':
 *          description: Internal server error
 */
router.post("/module/add", controller.createModule);

/**
 *  @swagger
 *  /experience/updateModule:
 *    put:
 *      tags:
 *        - Experience
 *      description: Add module to an experience.
 *      parameters:
 *        - in: query
 *          name: name_module
 *          type: string
 *          required: true
 *          description: Name of the module to add
 *        - in: query
 *          name: name_experience
 *          type: string
 *          required: true
 *          description: Name of the relevant experience
 *      responses:
 *        '200':
 *          description: Module added succeffuly
 *        '404':
 *          description: Module not found
 *        '449':
 *          description: Module is already registered
 *        '500':
 *          description: Internal server error
 */
router.put("/updateModule", controller.addModuleToAnExperience);

module.exports = router;
