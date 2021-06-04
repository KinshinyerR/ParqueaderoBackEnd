const express = require("express");
const { body, param } = require("express-validator");
const mongoose = require("mongoose");
const moment = require("moment");
moment.locale("es");

const Client = require("../models/monthlyClients.model");
const User = require("../models/entryAndExit.model");
const validate = require("../middleware/validate");
const { use } = require("./monthlyClients.controller");
let miParqueadero = 15;
let estacionados = 0;

const router = express.Router();

/******************************* ROUTES *********************************/
router.get("/getAll", getAll);
router.get("/getContrato", getContrato);
router.get("/getNoContrato", getNoContrato);
router.post("/entry", createEntry);
router.post("/exit", createExit);

async function getAll(req, res) {
  try {
    const allUsers = await User.find();
    if (!allUsers.length) {
      throw new Error(`Parqueadero vacío`);
    }
    res.send(allUsers);
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}

async function getContrato(req, res) {
  let vpcm = [];
  try {
    const allUsers = await User.find();
    if (!allUsers.length) {
      throw new Error(`Parqueadero vacío`);
    }
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].contratoMensual === true) {
        vpcm.push(allUsers[i]);
      }
    }
    res.send(vpcm);
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}

async function getNoContrato(req, res) {
  let vpsm = [];
  try {
    const allUsers = await User.find();
    if (!allUsers.length) {
      throw new Error(`Parqueadero vacío`);
    }
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].contratoMensual === false) {
        vpsm.push(allUsers[i]);
      }
    }
    res.send(vpsm);
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}

async function createEntry(req, res) {
  const { placa } = req.body;
  try {
    const userDB = await User.findOne({ placa: placa });
    if (userDB) {
      throw new Error(`El vehículo ya se encuentra registrado`);
    }
    const clientDB = await Client.findOne({
      placa: placa,
    });
    if (clientDB) {
      if (estacionados < miParqueadero) {
        const newUser = new User();
        newUser.placa = clientDB.placa;
        newUser.color = clientDB.color;
        newUser.horaIngreso = moment().format();
        newUser.contratoMensual = true;
        estacionados++;
        await newUser.save();
        res.send(newUser);
      }
    } else {
      if (estacionados < miParqueadero - 5) {
        const newUser = new User();
        newUser.placa = req.body.placa;
        newUser.color = req.body.color;
        newUser.horaIngreso = moment().format();
        newUser.contratoMensual = false;
        estacionados++;
        await newUser.save();
        res.send(newUser);
      } else {
        res.send("No contamos con un espacio disponible en este momento");
      }
    }
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}

async function createExit(req, res) {
  const { placa } = req.body;
  try {
    const userDB = await User.findOne({ placa: placa });
    if (!userDB) {
      throw new Error("El vehículo no se encuentra en el Parqueadero");
    }
    let now = moment();
    userDB.horaSalida = now;
    let before = moment(userDB.horaIngreso);
    const time = moment.duration(now.diff(before));
    userDB.valorAPagar = Math.floor(time.asMinutes()) * 1000;

    console.log(Math.floor(time.asMinutes()));
    console.log(userDB.valorAPagar);

    res.status(200).send(userDB);
    userDB.remove({ placa: placa });
  } catch (error) {
    console.log({ error });
    res.status(400).send(error.message);
  }
}
module.exports = router;
