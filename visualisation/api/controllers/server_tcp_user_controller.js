const errors = require("../common_variables");
const services = require("../services/server_tcp_user_service");

const createUser = async (req, res) => {
    const user = req.body.user;
    await services.createUser(user, (error, result) => {
        if (error === errors.already_registered) {
            return res.status(449).send({success: 0, data: error});
        } else if (error) {
            return res.status(500).send({success: 0, data: error});
        }
        return res.status(200).send({success: 1, data: result});
    });
};

const addResult = async (req, res) => {
    const user = req.body.user;
    const result = req.body.result;

    await services.addResult(result, user, (error, result) => {
        if (error === errors.already_registered) {
            return res.status(449).send({success: 0, data: error});
        } else if (error) {
            return res.status(500).send({success: 0, data: error});
        }
        return res.status(200).send({success: 1, data: result});
    });
};

const getAllUsers = async (req, res) => {
    try {
        const users = await services.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

const getUserById = async (req, res) => {
    try {
        const user_id = req.params.id;
        const user = await services.getUserById(user_id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }

}
const getAllCobayes = async (req, res) => {
    try {
        const cobayes = await services.getAllCobayes();
        res.status(200).json(cobayes);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
};

const deleteAllCobayes = async (req, res) => {
    try {
        await services.deleteAllCobayes();
        res.status(200).json({message: "All cobayes deleted"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
};

const deleteAllUsers = async (req, res) => {
    try {
        await services.deleteAllUsers();
        res.status(200).json({message: "All users deleted"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
};

const deleteUser = async (req, res) => {
    try {
        const user_id = req.params.id;
        await services.deleteUser(user_id);
        res.status(200).json({message: "User deleted"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}


module.exports = {
    createUser,
    addResult,
    getAllCobayes,
    deleteAllCobayes,
    deleteAllUsers,
    getAllUsers,
    getUserById,
    deleteUser
};
