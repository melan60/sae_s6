const variables = require("../common_variables");
const { User, Experience } = require('../models/index.models');

/**
 * function to get results for a user
 * @param {string} id_user - The ID of the user whose data we want
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const getIndividualData = async (id_user, callback) => {
    User.findOne({ _id: id_user })
        .exec()
        .then(user => {
            let resultat = {
                "nom": user.name,
                "prenom": user.firstName,
                "results": user.results.map((exp, index) => {
                    return {
                        num_exp: index + 1,
                        reactTime: exp.reactTime,
                        execTime: exp.execTime
                    }
                })
            }
            return callback(null, resultat)
        })
        .catch(e => {
            return callback(e)
        }); // TODO message err ou juste e
}

// ============================================================================
/**
 * function to configure the data for all graphs
 * @param {Array} nameOfAllExperiences - An array of String elements representing the name of each experiences
 * @returns {Array} - An array of JSON elements representing configuation for all graphs
 */
const configureGraphs = (nameOfAllExperiences) => {
    return [
        { labels: variables.age_category, title: "Temps de réaction en fonction de l'âge" },
        { labels: variables.genders, title: "Temps de réaction en fonction du sexe" },
        { labels: nameOfAllExperiences, title: "Temps d'exécution" },
        { labels: nameOfAllExperiences, title: "Temps de réaction" }
    ]
}

/**
 * function to initialize tables for each chart
 * @param {Array} configurations - An array of JSON elemnts that corresponds to the configuration of each graph
 * @return {Array} - An array of JSON elements representing initialized tables
 */
const initializeTables = (configurations) => {
    const results = [];

    for (let config of configurations) {
        results.push({
            labels: config.labels,
            titre: config.title,
            data: config.labels.map(variable => 0)
        });
    }
    return results;
}

/**
 * Determines a user's age category based on his age
 * @param {Number} age - The age of the user
 * @return {Number} - An integer representing the age category:
 *                    - 0: Below 12 years old
 *                    - 1: Between 12 and 19 years old
 *                    - 2: Between 20 and 59 years old
 *                    - 3: 60 years old and above
 */
const getCategoryAge = (age) => {
    if (age < 12) return 0;
    else if (age < 20) return 1;
    else if (age < 60) return 2;
    return 3;
}

/**
 * function to get all results
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const getReactAndExecTime = async (callback) => {
    const experiences = await Experience.find().exec();
    const nameOfAllExperiences = experiences.map(experience => experience.name);

    const configurations = configureGraphs(nameOfAllExperiences);
    const results = initializeTables(configurations);

    User.find()
        .exec()
        .then(users => {
            users.forEach(user => {
                var index_1 = getCategoryAge(user.age);
                var index_2 = results[1].labels.indexOf(user.gender);

                user.results.forEach((result, index) => {
                    results[0].data[index_1] += result.reactTime;
                    results[1].data[index_2] += result.reactTime;
                    results[2].data[index] += result.execTime;
                    results[3].data[index] += result.reactTime;
                });
            });
            return callback(null, results);
        })
        .catch(e => {
            return callback(e)
        }); // TODO message err ou juste e
}

// ============================================================================
/**
 * function to get all stimulis
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const getAllStimulis = async (callback) => {
    Experience.find()
        .exec()
        .then(experiences => {
            let stimulis = experiences.map(exp => exp.typeStimulus);
            stimulis = stimulis.filter((exp, index) => stimulis.indexOf(exp) === index);
            return callback(null, stimulis);
        })
        .catch(e => {
            return callback(e)
        }); // TODO message err ou juste e
}

// ============================================================================
const filterResultsGraph = async (data, callback) => {
    console.log(data);
}

module.exports = {
    getIndividualData,
    getReactAndExecTime,
    getAllStimulis,
    filterResultsGraph
}