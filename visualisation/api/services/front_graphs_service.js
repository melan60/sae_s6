const variables = require("../common_variables");
const {User, Experience} = require('../models/index_models');

/**
 * function to get results for a user
 * @param {string} id_user - The ID of the user whose data we want
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const getIndividualData = async (id_user, callback) => {
    const experiences = await Experience.find().exec();
    const nameOfAllExperiences = experiences.map(experience => experience.name);

    User.findOne({_id: id_user})
        .exec()
        .then(user => {
            const graph = [
                {
                    first: {
                        labels: nameOfAllExperiences,
                        title: "Temps d'exécution",
                        data: user.results.map(exp => exp.execTime)
                    },
                    second: {
                        labels: nameOfAllExperiences,
                        title: "Temps de réaction",
                        data: user.results.map(exp => exp.reactTime)
                    },
                },
                {
                    labels: nameOfAllExperiences,
                    title: "Nombre d'erreurs réalisées",
                    data: user.results.map(exp => exp.error)
                }
            ]
            console.log(graph[0])
            return callback(null, graph);
        })
        .catch(e => {
            return callback(e);
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
        {labels: variables.age_category, title: "Temps de réaction en fonction de l'âge"},
        {labels: variables.genders, title: "Temps de réaction en fonction du sexe"},
        {labels: nameOfAllExperiences, title: "Nombres d'erreurs réalisées"},
        {
            first: {labels: nameOfAllExperiences, title: "Temps d'exécution"},
            second: {labels: nameOfAllExperiences, title: "Temps de réaction"}
        }
    ]
}

/**
 * function to initialize tables for each chart
 * @param {Array} configurations - An array of JSON elemnts that corresponds to the configuration of each graph
 * @return {Array} - An array of JSON elements representing initialized tables
 */
const initializeTables = (configurations) => {
    return configurations.map(config => {
        if (config.first) {
            const results = {};
            for (let key in config) {
                results[key] = {
                    labels: config[key].labels,
                    title: config[key].title,
                    data: config[key].labels.map(variable => 0)
                }
            }
            return results;
        } else {
            return {
                labels: config.labels,
                title: config.title,
                data: config.labels.map(variable => 0)
            };
        }
    });
}

/**
 * Determines an average time for each category
 * @param {Array} data - Array with all results and length
 */
const makeAnAverage = (results) => {
    for (let result of results) {
        if (result.first) { //si le graphique a 2 courbes 
            for (let index in result) {
                // if et else pour tester qu'on ne divise pas par 0
                if(result.first.length[0]!=0){
                    result[index].data = result[index].data.map(value => value / result.first.length[0]);
                }
                else{
                    console.log("dans le else ---------------------------")
                    result[index].data = result[index].data.map(value => 0);
                }
                
            }
        } else {
            result.data.forEach((value,index)=>{
                if(result.length[index%result.length.length]!=0){
                    result.data[index] = value/result.length[index%result.length.length];
                }
                else{
                    result.data[index]=0
                }
            });
        }
    }
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
            var compteurByAge = [0,0,0,0];
            var compteurByGender = [0,0];
            users.forEach(user => {
                var index_1 = variables.age_category.indexOf(user.age) // getCategoryAge(user.age);
                var index_2 = results[1].labels.indexOf(user.gender);
                // TODO améliorer pour + d'évolutivité
                user.results.forEach((result, index) => {
                    compteurByAge[index_1]+=1;
                    compteurByGender[index_2]+=1;
                    results[0].data[index_1] += result.reactTime;
                    results[1].data[index_2] += result.reactTime;

                    results[2].data[index] += result.error;

                    results[3].first.data[index] += result.execTime;
                    results[3].second.data[index] += result.reactTime;
                });
            });
            results[0].length = compteurByAge;
            results[1].length = compteurByGender;
            results[2].length = [users.length];
            results[3].first.length = [users.length];
            results[3].second.length = [users.length];
            makeAnAverage(results);
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
/**
 * function to get all results for a stimulis
 * @param {string} data - The stimulis whose data we want
 * @param {function(error: Error, result: any)} callback
 * @return {Promise}
 */
const filterResultsGraph = async (data, callback) => {
    Experience.find({typeStimulus: data})
        .exec()
        .then(exp => {
            return callback(null, exp);
        })
        .catch(e => {
            return callback(e)
        });
}

module.exports = {
    getIndividualData,
    getReactAndExecTime,
    getAllStimulis,
    filterResultsGraph
}