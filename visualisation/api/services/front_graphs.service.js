const { User } = require('../models/index.models');

/**
 * function to get results for a user
 * @param {string} email
 * @param {string} password
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

/**
 * function to get all results
 * @param email
 * @param password
 * @param callback
 * @return {Promise}
 */
const getReactAndExecTime = async (callback) => {
    const resultsAge = {
        labels: ["Enfants", "Adolescent", "Adulte", "Personnes Agées"],
        titre: "Temps de réaction en fonction de l'âge",
        data: [0, 0, 0, 0]
    };
    const resultsSexe = {
        labels: ["Autre", "Féminin", "Masculin"],
        titre: "Temps de réaction en fonction du sexe",
        data: [0, 0, 0]
    };
    const resultExec = {
        labels: ["Expérience 1", "Expérience 2", "Expérience 3", "Expérience 4"],
        titre: "Temps d'exécution",
        data: [0, 0, 0, 0]
    };
    const resultReact = {
        labels: ["Expérience 1", "Expérience 2", "Expérience 3", "Expérience 4"],
        titre: "Temps de réaction",
        data: [0, 0, 0, 0]
    };

    User.find()
        .exec()
        .then(users => {
            console.log(users)
            users.forEach(user => {
                var index_age = 3;
                var index_sexe = resultsSexe.labels.indexOf(user.gender);

                if (user.age < 12) index_age = 0;
                else if (user.age < 20) index_age = 1;
                else if (user.age < 60) index_age = 2;

                user.results.forEach((result, index) => {
                    resultsAge.data[index_age] += result.reactTime;
                    resultsSexe.data[index_sexe] += result.reactTime;

                    resultExec.data[index] += result.execTime;
                    resultReact.data[index] += result.reactTime;

                    console.log(resultExec)

                });
            });
            return callback(null, [resultsAge, resultsSexe, resultExec, resultReact]);
        })
        .catch(e => {
            return callback(e)
        }); // TODO message err ou juste e
}

module.exports = {
    getIndividualData,
    getReactAndExecTime,
}