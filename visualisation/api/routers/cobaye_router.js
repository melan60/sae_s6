const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/auth_middleware');
const User = require('../models/user_schema');

router.get('/', middleware.authenticateJWT, async (req, res) => {
    if(req.user.typeUser && req.user.typeUser.includes('cobaye')) {
        try {
            const nomCobaye = req.params.nomCobaye;
            const user = await User.findOne({ name: nomCobaye });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user: user, });

        } catch (error) {
            console.error('Error fetching cobaye data:', error);
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        res.status(403).json({ message: "Access denied: This user is not an admin." });
    }
});
