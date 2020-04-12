'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/users');
var services_user = require('../services/user.services');
const Response = require('../services/response.js');
const UPLOAD_PATH = './upload/user/';

var UserController = {
  test: function(req,res){
    return Response.makeResponse(res,200,{message:'Todo bien!!!'})
  },
  saveUser: function(req,res){
    var user = new User();
    var params = req.body;
    console.log(params);

    user.name = params.name;
    user.email = params.email.toLowerCase();
    user.alias = params.alias;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';


    if (params.password) {
      //
      bcrypt.hash(params.password, null, null, function (err, hash) {
        user.password = hash;
        if (user.email) {
          user.save((err, user) => {
            let msg_error = 'Error al guardar el usuario'
            if (err)
            return Response.badResponse(res,msg_error)

            else if(!user)
            return Response.badResponse(res,msg_error)
            return Response.makeResponse(res,200,{
              message: 'Se  guardo el usuario',
              user: services_user.getUserJson(user)
            })


          });
        } else
        return Response.makeResponse(res,200,{message:'Falta datos para poder continuar'})

      })
    } else
    return Response.makeResponse(res,200,{message:'Falta los datos de la contraseña'})


  },
  updateUser: function(req, res) {
    var id_usuario = req.params.id;
    var params = req.body;

    // si es necesario actualizar la contraseña
    // soy  don chingon en el uso de promesas y sincronía
    services_user.getHashPassword(params.password).then(function (hash) {
      if (hash !== '') {
        params.password = hash;
      }
      User.findByIdAndUpdate(id_usuario, params, (err, userUpdate) => {
        if (err)
        return Response.badResponse(res,'Error al actualizar el usuario')

        else if (!userUpdate)
        return Response.makeResponse(res,404,{message:'El usuario no ha podido ser actualizado'})

        return Response.makeResponse(res,200,{
          message: 'Se  actualizó el usuario correctamente',
          user: services_user.getUserJson(userUpdate)
        })

      });
    });
  },
  getUserByid: function(req,res) {
    var id_usuario = req.params.id;
    console.log(id_usuario)
    if (id_usuario) {
      User.findOne({
        _id: id_usuario
      }, (error, user) => {
        if (error)
        return Response.badResponse(res,"Error al procesar su solicitud");

        // console.log(user_data);
        return Response.makeResponse(res,200,{
          message:'Todo bien',
          user:services_user.getUserJson(user)
        })
      })
    }else {
      Response.makeResponse(res,400,{message:'No se existen los parámetros necesarios'})
    }
  },

  login:function(req,res){
    var {email,password,gethash} = req.body;
    if (!email || !password) {
      return Response.badResponse(res,'Faltan datos para poder continuar')
    }



    User.findOne({
      email: email.toLowerCase()
    }, (error, user) => {
      if (error) {
        return Response.badResponse(res,'Error en la petición')
      }
      else if (!user)
      return Response.makeResponse(res,400,{message:'El usuario es incorrecto'})
      bcrypt.compare(password, user.password, (err, check) => {
        if (check && gethash) {
          return Response.makeResponse(res,200,{
            token: services_user.createToken(user),
            user_data: services_user.getUserJson(user),
            message: 'Datos correctos'
          });

        } else
        return Response.badResponse(res,'El usuario no ha podido iniciar sessión');


      })

    });

  },
  uploadFile:function(req,res){
    var id_usuario = req.params.id;
    var file_name = '';
    var data_update = {};
    console.log(req);
    // TODO -- > set uload file from data's
    if (req.files) {
      var file_path = req.files.image.path;
      let datos_file = services_user.getDataFileByPath(file_path);

      if (datos_file.valid_extend) {
        data_update.image = datos_file.name;
        User.findByIdAndUpdate(id_usuario, data_update, (err, userUpdate) => {
          if (err) {
            return Response.badResponse(res,'Error al actualizar el usuario')
          }
          else if (!userUpdate) {
            return Response.makeResponse(res,400,{message:'El usuario no ha podido ser actualizado'})
          } else {
            return Response.makeResponse(res,200,{
              message: 'Se  actualizó el usuario correctamente',
              user: services_user.getUserJson(userUpdate),
              image: data_update.image
            })
          }
        });
      } else {
        return Response.makeResponse(res,400,{message: 'El archivo no contiene la estructura adecuada'});
      }
    } else {
      return Response.badResponse(res,'No se ha recibido ningún archivo');
    }

  }

};
module.exports = UserController
