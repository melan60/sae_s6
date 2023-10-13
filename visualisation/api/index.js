// variables
const dotenv = require("dotenv");
const express = require("express");

const server = express();

// utilisation des variables d'environnement
dotenv.config();

// lancement du serveur
server.use(express.json());
server.use("/", (req, res) => {
  console.log("Accueil");
  res.send("Accueil");
});

server.listen(process.env.PORT_SERVER, () => {
  console.log(`Server is listening port ${process.env.PORT_SERVER}`);
});
