'use strict'

var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var EstadosSchema = Schema({
    id_core_estado: String,
    clave_estado: String,
    estado: String,
    abreviatura: String,
    core_pais_id: String

});
EstadosSchema.statics.paginate = paginate;

module.exports = mongoose.model('core_estados', EstadosSchema);
