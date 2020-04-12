'use strict'
var fs = require('fs');
var path = require('path');
var Artist = require('../models/artist');
var Albums = require('../models/album');
var Songs = require('../models/song');
var services_user = require('../services/user.services');
var mongoosePaginate = require('mongoose-pagination');

const UPLOAD_PATH = './upload/artist/';

var ArtisController = {
  test: function(req, res) {
    res.status(200).send({
      message: 'Una prueba para el controlador de artista'
    });
  },
  saveArtist: function(req, res) {
    var artist_params = req.body;

    var artist = new Artist();
    artist.name = artist_params.name;
    artist.description = artist_params.description;
    artist.genre = artist_params.genre;
    artist.country = artist_params.country;

    artist.image = 'null';

    artist.save((err, artistaData) => {
      if (err) res.status(500).send({
        message: 'Error no se ha guardado el artista'
      })
      if (artistaData)
        res.status(200).send({
          message: 'Se guardo con exito el artista',
          artist: artistaData
        });
      else
        res.status(401).send({
          message: 'Error no se ha guardado el artista'
        })

    });

  },
  updateArtist: function(req, res) {
    var id_artist = req.params.id;
    var artis_data_update = req.body;

    if (!id_artist) res.status(404).send({
      message: 'Error no existen los parámetros necesarios'
    });
    else {
      Artist.findByIdAndUpdate(
        id_artist, artis_data_update, (err, artistUpdate) => {
          if (err)
            res.status(500).send({
              message: 'Ocurrio un error al procesar su solicitud'
            });
          if (artistUpdate) {
            res.status(200).send({
              message: 'Se actualizó el artista',
              artist: artistUpdate
            });
          } else {
            res.status(404).send({
              message: 'Ocurrio un error al actualizar el artista'
            });
          }
        });
    }
  },
  getSimpleArtistById: function(req, res) {
    var id_artist = req.params.id;
    if (!id_artist) res.status(404).send({
      message: 'Error no existen los parámetros necesarios'
    });
    else {
      Artist.findOne({
        '_id': id_artist
      }, (err, artistaData) => {
        if (err)
          res.status(500).send({
            message: 'Ocurrio un error al procesar su solicitud'
          });
        if (artistaData) {
          res.status(200).send({
            message: 'Se localizó el artista',
            artist: artistaData
          });
        } else {
          res.status(404).send({
            message: 'No existe el artista'
          });
        }
      });
    }
  },
  getListArtisByPage: function(req, res) {
    var page = req.params.page || 1;
    var item_by_page = 7;
    Artist.find().sort('name').paginate(page, item_by_page, (err,
      artistas, items) => {
      if (err)
        res.status(500).send({
          message: 'Ocurrio un error al procesar su solicitud'
        });
      if (!artistas) {
        res.status(404).send({
          message: 'No existen artistas'
        });
      } else {
        return res.status(200).send({
          message: 'Todo bien',
          data: artistas
        });
      }
    });

  },
  deleteArtist: function(req, res) {
    var id_artist = req.params.id;
    Artist.findByIdAndRemove(id_artist, (err, artistRemove) => {
      if (err) {
        res.status(500).send({
          message: 'Ocurrio un error al procesar su solicitud'
        });
      } else {
        if (!artistRemove) {
          res.status(404).send({
            message: 'No es posible eliminar el artista'
          });
        } else {

          Albums.find({
            artist: artistRemove._id
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
                        artist: artistRemove
                      });
                    }
                  }
                });
              }
            }


          });
        }
      }
    });
  },
  //upload file image to artis
  uploadFile: function(req, res) {
    var id_artist = req.params.id;
    var file_name = '';
    var data_update = {};
    //  console.log(req.files);
    if (req.files) {
      var file_path = req.files.image.path;
      let datos_file = services_user.getDataFileByPath(file_path);

      if (datos_file.valid_extend) {
        data_update.image = datos_file.name;
        Artist.findByIdAndUpdate(id_artist, data_update, (err, ArtistUpdate) => {
          if (err) {
            res.status(500).send({
              message: 'Error al actualizar el Artista'
            });
          }
          if (!ArtistUpdate) {
            res.status(404).send({

              message: 'El Artista no ha podido ser actualizado'
            });
          } else {
            res.status(200).send({
              message: 'Se  actualizó el Artista correctamente',
              user: ArtistUpdate
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

  getImageUser: function(req, res) {
    var id_image = req.params.imageFile;
    var pt_image = UPLOAD_PATH + id_image;

    fs.exists(pt_image, function(exists) {
      if (exists) {
        res.sendFile(path.resolve(pt_image));
      } else {
        res.status(401).send({
          message: 'No existe la imagen',

        });
      }
    })
  }

};
module.exports = ArtisController;
