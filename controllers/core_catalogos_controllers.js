'use strict'
var EstadosModel = require('../models/catalogo_estados_model');

var CatalogoController = {
    getAllCoreEstados: function (req, res) {
        EstadosModel.find({}, (err, estados) => {
            if (err) {
                return res.status(500).send({message: 'Error al procesar su solicitud'});
            }
            return res.status(200).send({
                message: 'Todo bien',
                data: estados
            })
        });
    }

};

module.exports = CatalogoController;
