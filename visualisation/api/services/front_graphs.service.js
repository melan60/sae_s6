// TODO
// const mongoose = require("mongoose");
const { User } = require('../models/index.models');

const getIndividualData = async (id_user) => {
    User.findOne({ key: id_user })
        .exec()
        .then(res => callback(null, res))
        .catch(e => callback(e)); // TODO message err ou juste e
}

// const getReactAndExecTime = () => {
//     const fakeUserData = [
//         {
//             age: 10,
//             gender: "Autre",
//             results: [
//                 { experience_id: 0, reactTime: 100, execTime: 200 },
//                 { experience_id: 1, reactTime: 150, execTime: 220 },
//                 { experience_id: 2, reactTime: 120, execTime: 180 },
//                 { experience_id: 3, reactTime: 110, execTime: 210 },
//             ],
//         },
//         {
//             age: 15,
//             gender: "Féminin",
//             results: [
//                 { experience_id: 0, reactTime: 120, execTime: 190 },
//                 { experience_id: 1, reactTime: 130, execTime: 220 },
//                 { experience_id: 2, reactTime: 110, execTime: 200 },
//                 { experience_id: 3, reactTime: 140, execTime: 210 },
//             ],
//         },
//         // Ajoutez d'autres données fictives ici
//     ];

//     const resultsAge = {
//         labels: ["Enfants", "Adolescent", "Adulte", "Personnes Agées"],
//         data: [0, 0, 0, 0],
//     };
//     const resultsSexe = {
//         labels: ["Autre", "Féminin", "Masculin"],
//         data: [0, 0, 0],
//     };
//     const resultExec = {
//         labels: ["Expérience 1", "Expérience 2", "Expérience 3", "Expérience 4"],
//         data: [0, 0, 0, 0],
//     };
//     const resultReact = {
//         labels: ["Expérience 1", "Expérience 2", "Expérience 3", "Expérience 4"],
//         data: [0, 0, 0, 0],
//     };

//     fakeUserData.forEach(user => {
//         var index_age = 3;
//         var index_sexe = resultsSexe.labels.indexOf(user.gender);

//         if (user.age < 12) index_age = 0;
//         else if (user.age < 20) index_age = 1;
//         else if (user.age < 60) index_age = 2;

//         user.results.forEach(result => {
//             var index = result.experience_id;

//             resultsAge.data[index_age] += result.reactTime;
//             resultsSexe.data[index_sexe] += result.reactTime;
//             resultExec.data[index] += result.execTime;
//             resultReact.data[index] += result.reactTime;
//         });
//     });

//     return callback(null, resultReact);
// };

const getReactAndExecTime = async (req, res) => {
    const resultsAge = {
        labels: ["Enfants", "Adolescent", "Adulte", "Personnes Agées"],
        data: [0, 0, 0, 0]
    };
    const resultsSexe = {
        labels: ["Autre", "Féminin", "Masculin"],
        data: [0, 0, 0]
    };
    const resultExec = {
        labels: ["Expérience 1", "Expérience 2", "Expérience 3", "Expérience 4"],
        data: [0, 0, 0, 0]
    };
    const resultReact = {
        labels: ["Expérience 1", "Expérience 2", "Expérience 3", "Expérience 4"],
        data: [0, 0, 0, 0]
    };

    User.find()
        .exec()
        .then(users => {
            users.results.forEach(user => {
                var index_age = 3;
                var index_sexe = resultsSexe.labels.indexOf(user.gender);

                if (user.age < 12) index_age = 0;
                else if (user.age < 20) index_age = 1;
                else if (user.age < 60) index_age = 2;

                user.results.forEach(result => {
                    var index = result.experience_id;

                    resultsAge.data[index_age] += result.reactTime;
                    resultsSexe.data[index_sexe] += result.reactTime;

                    resultExec.data[index] += result.execTime;
                    resultReact.data[index] += result.reactTime;

                });
            });
            return callback(null, [resultsAge, resultsSexe, resultExec, resultReact]);
        })
        .catch(e => callback(e)); // TODO message err ou juste e
}

module.exports = {
    getIndividualData,
    getReactAndExecTime,
}