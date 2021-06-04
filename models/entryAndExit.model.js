const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const entryAndExitSchema = new Schema({
    placa: {type: String, required: true},
    color: {type: String, required: true},
    horaIngreso: {type: Date, required: true},
    horaSalida: {type: Date, required: false},
    valorAPagar: {type: String, required: false},
    contratoMensual: {type: Boolean, require: false}
});

module.exports = mongoose.model("entryAndExit", entryAndExitSchema);