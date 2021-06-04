const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientsSchema = new Schema({
    placa: {type: String, required: true},
    marca: {type: String, required: true},
    modelo: {type: Number, required: true},
    color: {type: String, required: false},
    nombreConductor: {type: String, required: true},
    pagoMensual: {type: Number, required: true}
});

module.exports = mongoose.model("clients", clientsSchema);