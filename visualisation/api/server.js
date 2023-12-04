// variables
const cors = require("cors");
const db = require("./db.init");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const routes_auth = require("./routers/front_auth.router");
const routes_graphs = require("./routers/front_graphs_router");
const routes_server_tcp_experience = require("./routers/server-tcp_experience_router");
const routes_server_tcp_user = require("./routers/server-tcp_user_router");

const server = express();


// utilisation des variables d'environnement
dotenv.config();

// utilisation des requetes CORS
server.use(cors());


// lancement du serveur
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));


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
  apis: ["server.js", "./routers/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOption);
server.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// redirections de chaques routes vers les routers appropriés
server.use("/api", routes_auth);
server.use("/graphs", routes_graphs);

server.use("/experience", routes_server_tcp_experience);
server.use("/user", routes_server_tcp_user);


// initialisation de la base de donnees

function initialisationBDD() {
  let dev_db_url;
  if (process.env.DOCKER_MONGO) {
    dev_db_url = `mongodb://mongodb:27017/${process.env.DATABASE_NAME}`
  }
  else
    dev_db_url = `mongodb://127.0.0.1/${process.env.DATABASE_NAME}`;
  mongoose.connect(dev_db_url)
      .then(async () => {
        await db.initBdD();
        server.listen(process.env.PORT_SERVER, () => {
          console.log(`Server is listening port ${process.env.PORT_SERVER}`);
        });
      })
      .catch(e => console.error(e)); // server
}

initialisationBDD();

/**
 * If path not found before then an error sent
 */
server.use("*", (req, res, next) => {
    const err = new Error("Not found !");
    err.status = 404;
    next(err);
});