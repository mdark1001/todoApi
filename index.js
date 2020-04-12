'use strict'

var mongoose = require('mongoose');
var app = require('./app.js');
var port = process.env.PORT || 3977;


mongoose.connect('mongodb://172.17.0.2:27017/todolist', (err, res) => {
  if (err) {
    console.log("Error al inicicar la db");
    console.log(err);
  } else {
    console.log("La conexión a la db esta corriendo...");
    app.listen(port, function() {
      console.log("Server api run http://localhost:" + port);
    });
  }
});
