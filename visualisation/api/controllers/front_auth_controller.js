const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user_model');
const errors = require("../common_variables");

/**
 * This function is used to generate a token for the login
 * @param user
 * @returns {*}
 */
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

/**
 * This function is used to login a user
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
 const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(401).json({ message: 'Login failed' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log('Email: ' + email);
        console.log(`Password match: ${isMatch}`); // This should log true if the password is correct
        console.log('The user type :' + user.typeUser); // Ensure it logs an array containing 'admin'

        if (isMatch && user.typeUser === 'cobaye') {
            const token = generateAccessToken({ userId: user._id });
            res.json({
                token: token,
                user: user,
            });
         } else if(!isMatch) {
            console.log('Login failed because of password mismatch');
            // Passwords don't match
            res.status(401).json({ message: 'Login failed, retry your email or password' });
        } else if (user.typeUser !== 'cobaye') {
            console.log('Login failed because user is not a cobaye');
            res.status(401).json({ message: 'You are not authorized to login.' });
        }
    } catch (error) {
        console.error('Error caught in login:', error); // Log the error
        res.status(500).json({ message: '\nInternal server error' });
    }
}

const getResults = async (req, res) => {
    let token = req.headers.token; //token
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) return res.status(401).json({
            title: 'unauthorized'
        })
        //token is valid
        User.findOne({ _id: decoded.userId }, (err, user) => {
            if (err) return console.log(err)
            return res.status(200).json({
                title: 'user grabbed',
                user: {
                    email: user.email,
                    name: user.name
                }
            })
        })
    })
}

module.exports = {
    login,
    getResults,
}