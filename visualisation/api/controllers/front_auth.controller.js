const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('../models/user_model');

const services = require('../services/front_auth.service');

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(401).json({ message: 'Login failed' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        console.log(`Password match: ${isMatch}`); // This should log true if the password is correct
        console.log('The password : ' + password + ' user.password : ' + user.password);
        console.log('The user type :' + user.typeUser); // Ensure it logs an array containing 'admin'

        if (isMatch && user.typeUser[0] === 'admin') {
            const token = generateAccessToken({ userId: user._id });
            res.json({
                token: token,
                name: user.name
            });
        } else {
            // Log the reason for failure
            console.log('Login failed because of password mismatch or user is not an admin');
            res.status(401).json({ message: 'You are not authorized to login.' });
        }
    } catch (error) {
        console.error('Error caught in login:', error); // Log the error
        res.status(500).json({ message: '\nInternal server error' });
    }
}

exports.getResults = async (req, res) => {
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

