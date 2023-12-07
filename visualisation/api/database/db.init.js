const { User, Experience, Result, Module } = require("../models/index_models");
const { experiences, modules, users } = require("./data");

const bcrypt = require("bcryptjs");
const chalk = require("chalk");


async function initModules() {
    try {
        modules.forEach(async (module) => {
            const module_found = await Module.findOne({ name: module.name }).exec();
            if (module_found === null) {
                const module_created = await Module.create({
                    name: module.name,
                    uc: module.uc,
                    description: module.description
                });
                console.log(chalk.bgGreen(`Added module :`) + chalk.bgYellow(module_created));
            }
        });
    } catch (err) {
        console.error(chalk.bgRed(`Cannot add module :`) + err);
    }
}

async function initExperiences() {
    const modules = await Module.find().exec();

    try {
        for (const experience of experiences) {
            const experience_found = await Experience.findOne({ name: experience.name }).exec();
            if (experience_found === null) {
                const experience_created = await Experience.create({
                    name: experience.name,
                    numero: experience.numero,
                    typeStimulus: experience.typeStimulus,
                    distraction: experience.distraction,
                    modules: modules
                });
                console.log(chalk.bgGreen(`Added experience :`) + experience_created);
            }
        }
    } catch (err) {
        console.error(chalk.bgRed(`Cannot add experience :`) + err);
    }
}

async function initResults() {
    let cpt = 0;
    let results = [];
    const experiences = await Experience.find().exec();
    for (let experience of experiences) {
        console.log(chalk.bgMagenta("Result for experience :" + experience));

        try {
            const result_created = await Result.create({
                experience: experience._id,
                error: cpt,
                reactTime: 5 + 2 * cpt,
                execTime: 8 + 3 * cpt
            });

            console.log(chalk.bgGreen(`Added result :`) + chalk.bgCyanBright(result_created));
            cpt += 1;
            results.push(result_created);

        } catch (err) {
            console.error(chalk.bgRed(`Cannot add result :`) + err);
        }
        return results;
    }
}

function initUsers() {

    users.forEach(async (user) => {
        try {
            const user_found = await User.findOne({ email: user.email }).exec();
            if (!user_found) {
                const results_users = await initResults();

                const user_created = await User.create({
                    name: user.name,
                    firstName: user.firstName,
                    password: bcrypt.hashSync(user.name),
                    email: user.email,
                    age: user.age,
                    gender: user.gender,
                    typeUser: user.typeUser,
                    results: results_users
                })
                console.log(chalk.bgBlue(`Added user :`) + user_created);
            }
        } catch (err) {
            console.error(chalk.bgRed(`Cannot add user :`) + err);
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
