//const Module = require('./models/module.model');
//const Chipset = require('./models/chipset.model');

const chalk = require("chalk");

const { User, Experience, Result, Module } = require("./models/index.models");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;


async function initModules() {
  let module = null;
  try {
    module = await Module.findOne({ name: "module1" }).exec();
    if (module === null) {
      module = new Module({
        name: "module1",
        uc: "esp32",
        description: "LED + buttons + motion sensor",
      });
      module = await module.save();
      console.log(chalk.bgGreen("Added module Module"));
    }
  } catch (err) {
    console.log(chalk.bgRed("Cannot add module Module !"));
  }
}

async function initResults() {
  let result1 = null;
  let result2 = null;
  try {
    // result1 = await Result.findOne({ name: "result1" }).exec();
    // if (result1 === null) {
    result1 = new Result({
      experience: "Experience 1",
      reactTime: 10,
      execTime: 12,
    });
    result1 = await result1.save();
    console.log(chalk.bgGreen("Added result1 Result"));
    // }
  } catch (err) {
    console.log(chalk.bgRed("Cannot add result1 Result !"));
  }
  try {
    // result2 = await Result.findOne({ name: "result2" }).exec();
    // if (result2 === null) {
    result2 = new Result({
      experience: "Experience 2",
      reactTime: 12,
      execTime: 13,
    });
    result2 = await result2.save();
    console.log(chalk.bgGreen("Added result2 Result"));
    // }
  } catch (err) {
    console.log(chalk.bgRed("Cannot add result2 Result !"));
  }
}

async function initExperiences() {
  let exp1 = null;
  let exp2 = null;
  try {
    console.log(chalk.bgBlue("INIT EXPERIENCES "));

    exp1 = await Experience.findOne({ name: "Experience 1" }).exec();

    if (exp1 === null) {
      exp1 = new Experience({
        name: "Experience 1",
        typeStimulus: "visuel",
        // distraction: "58ae1d8f-027b-4061-a4c7-b37c3f8ed54e",
        // modules: "esp32",
      });
      exp1 = await exp1.save();
      console.log(chalk.bgGreen("Added experience 1"));
    }
  } catch (err) {
    console.log(chalk.bgRed("Cannot add experience 1"));
  }
  try {
    exp2 = await Experience.findOne({ name: "Experience 2" }).exec();
    if (exp2 === null) {
      exp2 = new Experience({
        name: "Experience 2",
        typeStimulus: "visuel",
        distraction: "bruit",
        // modules: "esp32",
      });
      exp2 = await exp2.save();
      console.log(chalk.bgGreen("Added experience 2"));
    }
  } catch (err) {
    console.log(chalk.bgRed("Cannot add experience 2"));
  }
}

async function initUsers() {
  let user = null;
  try {
    user = await User.findOne({ name: "Johnson" }).exec();

    console.log(chalk.bgCyan("USER 1 : \n"), user, "\n");

    if (user === null) {
      const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
      const password = bcrypt.hashSync("Johnson", salt);

      let res = await Result.findOne({
        experience: "457870657269656e63652031",
      }).exec();

      console.log("RES : \n", res, "\n");

      user = new User({
        name: "Johnson",
        firstName: "Emily",
        password: password,
        email: "johnEmily@gmail.com",
        age: 25,
        gender: "Féminin",
        typeUser: ["cobaye"],
        results: [res],
      });

      console.log(chalk.bgCyan("USER 1 : \n"), user, "\n");

      user = await user.save();
      console.log(chalk.bgGreen("Added user ! "));

    } else {
      console.log(chalk.bgYellow("User already exist."));
    }
  } catch (err) {
    console.log(chalk.bgRed("Cannot add user"));
    console.log(err);
  }

  try {
    user = await User.findOne({ name: "Patel" }).exec();

    console.log(chalk.bgCyan("USER 2 : \n"), user, "\n");

    if (user === null) {
      const salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
      const password = bcrypt.hashSync("patel", salt);

      user = new User({
        name: "Patel",
        firstName: "Aiden",
        password: password,
        email: "patelaiden@gmail.com",
        age: 31,
        gender: "Masculin",
        typeUser: ["admin"],
      });

      console.log(chalk.bgCyan("USER 2 : \n"), user, "\n");
      user = await user.save();
      console.log(chalk.bgGreen("Added user"));

    } else {
      console.log(chalk.bgYellow("User already exist"));
    }
  } catch (err) {
    console.log(chalk.bgRed("Cannot add user"));
    console.log(err);
  }
}

async function initBdD() {
  let dev_db_url = "mongodb://127.0.0.1/saeS5";
  await mongoose.connect(dev_db_url);
  await initExperiences();
  await initModules();
  await initResults();
  await initUsers();
}

initBdD();

module.exports = {
  initBdD,
};
