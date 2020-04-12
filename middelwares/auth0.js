'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
const secret = '4a63f76ca6f6';

exports.ensureAuth0 = function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: 'La petición no tiene los headers necesarios'
    })

  }
  var token = req.headers.authorization.replace(/['"]+/g, '');

  try {
    var payload = jwt.decode(token, secret);
    if (payload.exp <= moment.unix()) {
      return res.status(401).send({
        message: 'El token ha expirado'
      })
    }
  } catch (ex) {
    //console.log(ex);
    return res.status(403).send({
      message: 'Token no valido' + ex
    })
  }
  req.user = payload;
  next();
};
