const {User, Experience, Result, Module} = require("./models/index_models");
const bcrypt = require("bcryptjs");
const chalk = require("chalk");

async function initModules() {
    try {
        const module = await Module.findOne({name: "module1"}).exec();
        if (module === null) {
            const module_created = await Module.create({
                name: "module1",
                uc: "esp32",
                description: "led + buttons + motion sensor"
            });
            console.log(chalk.bgGreen(`Added module :`) + chalk.bgYellow(module_created));
        }
    } catch (err) {
        console.error(chalk.bgRed(`Cannot add module :`) + err);
    }
}

async function initExperiences() {
    const modules = await Module.findOne({name: "module1"}).exec();

    const experiences = [
        {
            name: "Vitesse de la lumière",
            numero: 1,
            typeStimulus: "Visuel",
            distraction: "",
            modules: modules,
        },
        {
            name: "Vitesse de la lumière bis",
            numero: 2,
            typeStimulus: "Visuel",
            distraction: "Sonore",
            modules: modules,
        },
        {
            name: "Vitesse de réflexion",
            numero: 3,
            typeStimulus: "Visuel",
            distraction: "",
            modules: modules,
        },
        {
            name: "Vitesse du son ",
            numero: 4,
            typeStimulus: "Sonore",
            distraction: "",
            modules: modules
        }, {
            name: "Chaise musicale",
            numero: 5,
            typeStimulus: "Sonore",
            distraction: "",
            modules: modules,
        }
    ];

    try {
        for (const experience of experiences) {
            const experience_found = await Experience.findOne({name: experience.name}).exec();
            if (experience_found === null) {
                const experience_created = await Experience.create({
                    name: experience.name,
                    numero: experience.numero,
                    typeStimulus: experience.typeStimulus,
                    distraction: experience.distraction,
                    modules: experience.modules
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
                error: 2,
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

    const users = [
        {
            name: "Johnson",
            firstName: "Emily",
            email: "johnEmily@gmail.com",
            age: "Adulte",
            gender: "Féminin",
            typeUser: "admin",
        }, {
            name: "Patel",
            firstName: "Aiden",
            email: "patelaiden@gmail.com",
            age: "Adulte",
            gender: "Masculin",
            typeUser: "cobaye",
        }
    ]

    users.forEach(async (user) => {
        try {
            const user_found = await User.findOne({email: user.email}).exec();
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
