const jwt = require('jsonwebtoken');
const services = require('../services/front_auth.service');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

const connectToFront = async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;

    await services.connectToFront(email, password, (error, user) => {
        if (error) {
            return res.status(500).send({ success: 0, data: error });
        }
        if (user === null) {
            return res.status(404).send({ success: 0, data: "Email ou mot de passe incorrect" });
        }

        // const accessToken = generateAccessToken(user); // TODO
        const data = {
            user: user,
            // accessToken: accessToken
        }
        return res.status(200).send({ success: 1, data: data });
    });
}

module.exports = { connectToFront }