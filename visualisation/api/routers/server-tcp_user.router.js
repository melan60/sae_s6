const express = require('express');
const controller = require('../controllers/server-tcp_user.controller');
const router = express.Router();

// /**
//  * @swagger
//  * /user/add:
//  *   post:
//  *     tags:
//  *       - USERS
//  *     description: Create a new user with the specified properties.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               firstName:
//  *                 type: string
//  *               password:
//  *                 type: string
//  *               email:
//  *                 type: string
//  *               age:
//  *                 type: number
//  *               gender:
//  *                 type: string
//  *               typeUser:
//  *                 type: string
//  *             example:
//  *               name: John
//  *               firstName: Doe
//  *               password: mypassword
//  *               email: john@example.com
//  *               age: 30
//  *               gender: Masculin
//  *               typeUser: cobaye
//  *     responses:
//  *       '200':
//  *         description: User created succeffuly
//  *       '400':
//  *         description: Erreur de validation du corps de la requête
//  */
router.post("/add", controller.createUser);

module.exports = router;