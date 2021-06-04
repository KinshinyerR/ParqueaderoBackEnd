const express = require("express");
const { body, param } = require("express-validator");
const mongoose = require("mongoose");

const Client = require("../models/monthlyClients.model");
const validate = require("../middleware/validate");

const router = express.Router();

/******************************* ROUTES *********************************/
//GET ALL CLIENTS
router.get("/getAll", getAll);

//GET A CLIENT WITH ID
router.get("/getbyid/:placa", getById);

//POST CREATE A NEW CLIENT
router.post(
  "/create",
  validate([
    body("placa").exists().isString().trim().withMessage("Placa inválida"),
    body("marca").exists().isString().trim().withMessage("Marca inválida"),
    body("modelo").exists().isNumeric().trim().withMessage("Modelo inválido"),
    body("color").exists().isString().trim().withMessage("Color inválido"),
    body("nombreConductor")
      .exists()
      .isString()
      .trim()
      .withMessage("Nombre inválido"),
    body("pagoMensual")
      .exists()
      .isNumeric()
      .trim()
      .withMessage("Monto inválido"),
  ]),
  create
);

//PUT UPDATE A CLIENT
router.put(
  "/update",
  validate([
    body("placa").optional().isString().trim().withMessage("Placa inválida"),
    body("marca").optional().isString().trim().withMessage("Marca inválida"),
    body("modelo").optional().isNumeric().trim().withMessage("Modelo inválido"),
    body("color").optional().isString().trim().withMessage("Color inválido"),
    body("nombreConductor")
      .optional()
      .isString()
      .trim()
      .withMessage("Nombre inválido"),
    body("pagoMensual")
      .optional()
      .isNumeric()
      .trim()
      .withMessage("Monto inválido"),
  ]),
  update
);

//DELETE REMOVE A CLIENT WITH ID
router.delete("/delete/:placa", remove);

/******************************* FUNCTIONS *********************************/

function getAll(req, res) {
  Client.find()
    .then((clients) => res.send(clients))
    .catch((error) => res.status(400).json(error));
}

async function getById(req, res) {
  try {
    const clientDB = await Client.findOne({placa: req.params.placa});

    if (!clientDB) {
      throw new Error(`El vehículo NO se encuentra registrado`);
    }

    res.status(200).send(clientDB);
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}

async function create(req, res) {
  const { placa } = req.body;
  try {
    const clientDB = await Client.findOne({
      placa: placa,
    });
    if (clientDB) {
      throw new Error(`El vehículo ya se encuentra registrado`);
    }
    const newClient = new Client(req.body);
    await newClient.save();
    res.status(200).send(`Vehículo registado con exito`);
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}

async function update(req, res) {
  const { placa } = req.body;
  try {
    const clientDB = await Client.findOne({ placa: placa });

    if (!clientDB) {
      throw new Error(`El vehículo NO encontrado`);
    }

    Object.assign(clientDB, req.body);
    clientDB.save();
    res.status(200).send(clientDB);
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}

async function remove(req, res) {
  try {
    const clientDB = await Client.findOne({placa: req.params.placa});

    if (!clientDB) {
      throw new Error(`El vehículo NO se encuentra registrado`);
    }

    clientDB.remove({placa: req.params.placa});
    res.status(200).send('Eliminado');
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}
module.exports = router;
