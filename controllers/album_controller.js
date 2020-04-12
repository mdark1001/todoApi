'use strict'
var fs = require('fs');
var path = require('path');
var Album = require('../models/album');
var Songs = require('../models/song');
var services_user = require('../services/user.services');
var mongoosePaginate = require('mongoose-pagination');

const UPLOAD_PATH = './upload/album/';
var AlbumController = {
  prueba: function(req, res) {
    res.status(200).send({
      message: 'Petición de prueba para el controlador de Album'
    });
  },
  saveAlbum: function(req, res) {
    var album = new Album();
    var params = req.body;

    if (!params.id_artist) {
      return res.send(404).send({
        message: 'Error no existen los paramétros necesarios'
      });
    } else {
      album.title = params.title;
      album.description = params.description;
      album.year = params.year;
      album.image = 'null';
      album.artist = params.id_artist;
      album.save((err, albumData) => {
        if (err || !albumData) {
          return res.status(500).send({
            message: 'Error al procesar su solicitud'
          });
        } else {
          if (albumData) {
            return res.status(200).send({
              message: 'Se creó correctamente el album',
              album: albumData

            });
          }
        }

      })

    }
  },
  getListaAlbumPage: function(req, res) {
    var page = req.params.page || 1;
    var item_by_page = 2;
    Album.find().sort('year').populate({
      path: 'artist'
    }).paginate(page, item_by_page, (err, result) => {
      if (err)
        return res.status(404).send({
          message: 'Error al procesar su solicitud'
        });
      res.status(200).send({
        message: 'Todo bien',
        data: result
      })
    })


  },
  getAlbumById: function(req, res) {

    var id_album = req.params.id;
    if (!id_album) {
      return res.status(404).send({
        message: 'Error no existen los paramentros necesarios'
      });
    } else {
      Album.find({
        _id: id_album
      }).populate({
        path: 'artist'
      }).exec((err, albumData) => {
        if (err || !albumData) {
          return res.status(500).send({
            message: 'Error  no existe el album solicitado'
          });
        } else {

          return res.status(200).send({
            message: 'Todo bien',
            album: albumData

          });
        }
      });

    }

  },
  updateAlbum: function(req, res) {
    var id_album = req.params.id;
    var album_data_update = req.body;

    if (!id_album) {
      return res.status(404).send({
        message: 'Error no existen los parámetros necesarios'
      });
    } else {
      Album.findByIdAndUpdate(
        id_album, album_data_update, (err, albumUpdate) => {
          if (err || !albumUpdate)
            res.status(500).send({
              message: 'Ocurrio un error al procesar su solicitud'
            });
          if (albumUpdate) {
            res.status(200).send({
              message: 'Se actualizó el album',
              artist: albumUpdate
            });
          } else {
            res.status(404).send({
              message: 'Ocurrio un error al actualizar el album'
            });
          }
        });
    }
  },
  setImageAlbum: function(req, res) {
    var id_album = req.params.id;
    var file_name = '';
    var data_update = {};
    //  console.log(req.files);
    if (req.files) {
      var file_path = req.files.image.path;
      let datos_file = services_user.getDataFileByPath(file_path);

      if (datos_file.valid_extend) {
        data_update.image = datos_file.name;
        Album.findByIdAndUpdate(id_album, data_update, (err, albumUpdate) => {
          if (err) {
            res.status(500).send({
              message: 'Error al actualizar el Album'
            });
          }
          if (!albumUpdate) {
            res.status(404).send({

              message: 'El Album no ha podido ser actualizado'
            });
          } else {
            res.status(200).send({
              message: 'Se  actualizó el Album correctamente',
              user: albumUpdate
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
  },
  getImageAlbum: function(req, res) {
    var id_image = req.params.imageFile;
    var pt_image = UPLOAD_PATH + id_image;
    console.log(pt_image);
    fs.exists(pt_image, function(exists) {
      if (exists) {
        res.sendFile(path.resolve(pt_image));
      } else {
        res.status(401).send({
          message: 'No existe la imagen',

        });
      }
    });
  },
  deleteAlbum: function(req, res) {
    var id_album = req.params.id;
    if (!id_album) {
      return res.status(404).send({
        message: 'Error no existen los parámetros necesarios'
      });
    }
    Album.find({
      '_id': id_album
    }).remove((err, albumsRemove) => {
      if (err)
        res.status(500).send({
          message: 'Ocurrio un error al procesar su solicitud'
        });
      else {
        if (!albumsRemove) {
          res.status(404).send({
            message: 'No es posible eliminar los albums del artista'
          });
        } else {
          Songs.find({
            album: albumsRemove._id
          }).remove((err, songRemove) => {
            if (err)
              return res.status(500).send({
                message: 'Ocurrio un error al procesar su solicitud'
              });
            else {
              if (!songRemove) {
                res.status(404).send({
                  message: 'No es posible eliminar los albums del artista'
                });
              } else {
                res.status(200).send({
                  message: 'Se eliminó correctamente el artista',
                  album: albumsRemove
                });
              }
            }
          });
        }
      }
    });

  }
}
module.exports = AlbumController;
