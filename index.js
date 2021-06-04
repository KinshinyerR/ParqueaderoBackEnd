require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");

const clientsController = require("./controllers/monthlyClients.controller");
const usersController = require("./controllers/entryAndExit.controller");

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/clients", clientsController);
app.use("/users", usersController);

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Base de datos conectada");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`servidor iniciado en el puerto ${port}`);
    });
  })
  .catch((error) => console.error(error));
