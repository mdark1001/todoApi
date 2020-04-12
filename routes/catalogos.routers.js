var express=require('express');
var EstadosController=require('../controllers/core_catalogos_controllers');

var api=express.Router();

api.get('/catalogo/estados',EstadosController.getAllCoreEstados);

module.exports=api;