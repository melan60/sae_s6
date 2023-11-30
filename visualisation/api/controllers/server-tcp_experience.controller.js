const errors = require("../common_variables");
const services = require("../services/server-tcp_experience.service");

const createExperience = async (req, res) => {
  const experience = req.body.experience;

  await services.createExperience(experience, (error, result) => {
    if (error === errors.already_registered) {
      return res.status(449).send({ success: 0, data: error });
    } else if (error) {
      return res.status(500).send({ success: 0, data: error });
    }
    return res.status(200).send({ success: 1, data: result });
  });
};

const createModule = async (req, res) => {
  const module = req.body.module;

  await services.createModule(module, (error, result) => {
    if (error === errors.already_registered) {
      return res.status(449).send({ success: 0, data: error });
    } else if (error) {
      return res.status(500).send({ success: 0, data: error });
    }
    return res.status(200).send({ success: 1, data: result });
  });
};

const addModuleToAnExperience = async (req, res) => {
  const name_module = req.query.name_module;
  const name_experience = req.query.name_experience;

  await services.addModuleToAnExperience(
    name_module,
    name_experience,
    (error, result) => {
      if (error === errors.already_registered) {
        return res.status(449).send({ success: 0, data: error });
      } else if (error === errors.not_found) {
        return res.status(404).send({ success: 0, data: error });
      } else if (error) {
        return res.status(500).send({ success: 0, data: error });
      }
      return res.status(200).send({ success: 1, data: result });
    }
  );
};

const getExperience = async (req, res) => {
  const numero = req.query.numero;

  await services.getExperience(numero, (err, result) => {
    if (err) return res.status(400).send({ success: 0, data: err });
    return res.status(200).send({ success: 1, data: result });
  });
};

const getAllExperiences = async (req, res) => {
  await services.getAllExperiences((err, result) => {
    if (err) return res.status(400).send({ success: 0, data: err });
    return res.status(200).send({ success: 1, data: result });
  });
};

const getLastExperience = async (req, res) => {
  await services.getLastExperience((err, result) => {
    if (err) return res.status(400).send({ success: 0, data: err });
    return res.status(200).send({ success: 1, data: result });
  });
};

module.exports = {
  createExperience,
  createModule,
  addModuleToAnExperience,
  getExperience,
  getAllExperiences,
  getLastExperience,
};
