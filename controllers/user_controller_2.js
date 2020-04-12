'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/users');
var services_user = require('../services/user.services');
const UPLOAD_PATH = './upload/user/';

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando una acción del controlador usuario'
    })
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;
    console.log(params);

    user.nombre = params.nombre;
    user.apellidop = params.apellidop;
    user.apellidom = params.apellidom;
    user.email = params.email.toLowerCase();
    user.id_estado = params.id_estado;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';


    if (params.password) {
        //
        bcrypt.hash(params.password, null, null, function (err, hash) {
            user.password = hash;
            if (user.email) {
                user.save((err, user_data) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error al guardar el usuario'
                        })
                    } else {
                        if (!user_data) {
                            res.status(500).send({
                                message: 'Error al guardar el usuario'
                            })
                        } else {
                            res.status(200).send({
                                message: 'Se  guardo el usuario',
                                user: user_data
                            })
                        }
                    }
                });
            } else {
                res.status(200).send({
                    message: 'Faltan algunos datos'
                })
            }
        })
    } else {
        //
        res.status(200).send({
            message: 'Falta los datos de la contraseña'
        })
    }

}

function login(req, res) {
    var params = req.body;
    if (!params.email || !params.password) {
        res.status(200).send({
            message: 'Error faltan algunos datos'
        })
    } else {
        var email = params.email;
        var password = params.password;

        User.findOne({
            email: email.toLowerCase()
        }, (error, user) => {
            if (error) {
                res.status(200).send({
                    message: 'Error en la petición'
                })
            } else {
                if (!user) {
                    res.status(400).send({
                        message: 'Error el usuario no existe'
                    });
                } else {
                    bcrypt.compare(password, user.password, (err, check) => {
                        if (check && params.gethash) {
                            res.status(200).send({
                                token: services_user.createToken(user),
                                user_data: {
                                    nombre_completo: `${user.nombre} ${user.apellidop} ${user.apellidom}`,
                                    image: user.image,
                                    id_user: user._id
                                },
                                message: 'Datos correctos'
                            });

                        } else {
                            res.status(404).send({

                                message: 'El usuario no ha podido iniciar sessión'
                            });

                        }

                    })
                }

            }
        });
    }
}



function updateUser(req, res) {
    var id_usuario = req.params.id;
    var params = req.body;

    // si es necesario actualizar la contraseña
    // soy  don chingon en el uso de promesas y sincronía
    getHashPassword(params.password).then(function (hash) {
        if (hash !== '') {
            params.password = hash;
        }
        User.findByIdAndUpdate(id_usuario, params, (err, userUpdate) => {
            if (err) {
                res.status(500).send({

                    message: 'Error al actualizar el usuario'
                });
            }
            if (!userUpdate) {
                res.status(404).send({

                    message: 'El usuario no ha podido ser actualizado'
                });
            } else {
                res.status(200).send({
                    message: 'Se  actualizó el usuario correctamente',
                    user: userUpdate
                })
            }
        });
    });
}

function uploadFile(req, res) {
    var id_usuario = req.params.id;
    var file_name = '';
    var data_update = {};
    //  console.log(req.files);
    if (req.files) {
        var file_path = req.files.image.path;
        let datos_file = services_user.getDataFileByPath(file_path);

        if (datos_file.valid_extend) {
            data_update.image = datos_file.name;
            User.findByIdAndUpdate(id_usuario, data_update, (err, userUpdate) => {
                if (err) {
                    res.status(500).send({
                        message: 'Error al actualizar el usuario'
                    });
                }
                if (!userUpdate) {
                    res.status(404).send({

                        message: 'El usuario no ha podido ser actualizado'
                    });
                } else {
                    res.status(200).send({
                        message: 'Se  actualizó el usuario correctamente',
                        user: userUpdate,
                        image: data_update.image
                    })
                }
            });
        } else {
            res.status(401).send({
                message: 'El archivo no contiene la estructura adecuada',

            });
        }
    } else {
        res.status(401).send({
            message: 'No se ha recibido ningún archivo',

        });
    }
}

function getImageUser(req, res) {
    var id_image = req.params.imageFile;
    var pt_image = UPLOAD_PATH + id_image;

    fs.exists(pt_image, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(pt_image));
        } else {
            res.status(401).send({
                message: 'No existe la imagen',

            });
        }
    })
}

function getUserByid(req, res) {
    var id_usuario = req.params.id;
    if (id_usuario) {
        User.findOne({
            _id: id_usuario
        }, (error, user_data) => {
            if (error)
                return res.status(500).send({
                    message: "Error al procesar su solicitud"
                });
           // console.log(user_data);
            user_data.password = '';
            user_data.password2='';
            res.status(200).send({
                message: 'Todo bien',
                user: user_data
            })
        })
    } else {
        res.status(401).send({
            message: 'No se existen los parámetros necesarios',

        });
    }
}


module.exports = {
    pruebas,
    saveUser,
    getUserByid,
    login,
    updateUser,
    uploadFile,
    getImageUser
};
