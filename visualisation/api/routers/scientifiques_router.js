const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth_middleware');
const User = require('../models/user_schema');

router.get('/scientifique/:nomScientifique', middleware.authenticateJWT, async (req, res) => {
    if(req.user.typeUser && req.user.typeUser.includes('admin')) {
        try {
            const nomScientifique = req.params.nomScientifique;
            const user = await User.findOne({ name: nomScientifique });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ user: user });

            res.status(200).json(scientifiqueData);
        } catch (error) {
            console.error('Error fetching scientifique data:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(403).json({ message: "Access denied: This user is not an admin." });
    }
});
