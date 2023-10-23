// variables
const dotenv = require("dotenv");
const express = require("express");
const routes_graphs = require("./routers/front_graphs.router");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const server = express();


// utilisation des variables d'environnement
dotenv.config();


/**
 * Import and define swagger doc
 */

/** Swagger Initialization - START */
const swaggerOption = {
  swaggerDefinition: (swaggerJsdoc.Options = {
    info: {
      title: "API SAE-S5",
      description: "API documentation",
      servers: [`http://localhost:${process.env.PORT_SERVER}/`],
    },
  }),
  apis: ["index.js", "./routers/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOption);
server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));


// lancement du serveur
server.use(express.json());


// redirections de chaques routes vers les routers appropriés
server.use("/graphs", routes_graphs);

server.listen(process.env.PORT_SERVER, () => {
  console.log(`Server is listening port ${process.env.PORT_SERVER}`);
});
