const { User, Experience, Result, Module } = require("./models/index.models");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;

async function initModules() {
  try {
    const module = await Module.findOne({ name: "module1" }).exec();
    if (module === null) {
      const module_created = await Module.create({
        name: "module1",
        uc: "esp32",
        description: "led + buttons + motion sensor"
      });
      console.log(`added module : ${module_created}`);
    }
  } catch (err) {
    console.error(`cannot add module : ${err}`);
  }
}

async function initExperiences() {
  const modules = await Module.findOne({ name: "module1" }).exec();

  const experiences = [
    {
      name: "Expérience n°1",
      typeStimulus: "Visuel",
      distraction: "Sonore",
      modules: modules
    }, {
      name: "Expérience n°2",
      typeStimulus: "Sonore",
      distraction: "",
      modules: modules
    }
  ]

  try {
    experiences.forEach(async (experience) => {
      const experience_found = await Experience.findOne({ name: experience.name }).exec();
      if (experience_found === null) {
        const experience_created = await Experience.create({
          name: experience.name,
          typeStimulus: experience.typeStimulus,
          distraction: experience.distraction,
          modules: experience.modules
        });
        console.log(`added experience : ${experience_created}`);
      }
    });
  } catch (err) {
    console.error(`cannot add experience : ${err}`);
  }
}

async function initResults() {
  let cpt = 0;
  let results = [];
  const experiences = await Experience.find().exec();
  for (let experience of experiences) {
    console.log(experience)
    try {
      const result_created = await Result.create({
        experience: experience._id,
        reactTime: 5 + 2 * cpt,
        execTime: 8 + 3 * cpt
      });
      console.log(`added result : ${result_created}`);
      cpt += 1;
      results.push(result_created);
    } catch (err) {
      console.error(`error : ${err}`);
    }
  }
  return results;
}

function initUsers() {
  const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);

  const users = [
    {
      name: "Johnson",
      firstName: "Emily",
      email: "johnEmily@gmail.com",
      age: 25,
      gender: "Féminin",
      typeUser: "admin",
    }, {
      name: "Patel",
      firstName: "Aiden",
      email: "patelaiden@gmail.com",
      age: 31,
      gender: "Masculin",
      typeUser: "cobaye",
    }
  ]

  users.forEach(async (user) => {
    try {
      const user_found = await User.findOne({ email: user.email }).exec();
      if (!user_found) {
        const results_users = await initResults();

        const user_created = await User.create({
          name: user.name,
          firstName: user.firstName,
          password: bcrypt.hashSync(user.name, salt),
          email: user.email,
          age: user.age,
          gender: user.gender,
          typeUser: user.typeUser,
          results: results_users
        })
        console.log(`added user : ${user_created}`);
      }
    } catch (err) {
      console.error(`cannot add user : ${err}`);
    }
  });
}

async function initBdD() {
  await initModules();
  await initExperiences();
  initUsers();
}

module.exports = {
  initBdD,
};
