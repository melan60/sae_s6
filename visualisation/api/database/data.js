const experiences = [
    {
        name: "Vitesse de la lumière",
        numero: 1,
        typeStimulus: "Visuel",
        distraction: "",
    },
    {
        name: "Vitesse de la lumière bis",
        numero: 2,
        typeStimulus: "Visuel",
        distraction: "Sonore",
    },
    {
        name: "Vitesse de réflexion",
        numero: 3,
        typeStimulus: "Visuel",
        distraction: "",
    },
    {
        name: "Vitesse du son",
        numero: 4,
        typeStimulus: "Sonore",
        distraction: "",
    }, {
        name: "Mimétisme",
        numero: 5,
        typeStimulus: "Visuel",
        distraction: "",
    }
];

const modules = [
    {
        name: "module1",
        uc: "esp32",
        description: "led + buttons + motion sensor"
    }
];

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
];

module.exports = {
    experiences,
    modules,
    users
};
