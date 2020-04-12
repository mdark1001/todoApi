var express = require('express');

var AlbumController = require('../controllers/album_controller');
var md_auth0 = require('../middelwares/auth0');
var multipart = require('connect-multiparty');
var md_upload = multipart({
  uploadDir: './upload/album'
});

var api = express.Router();
api.get('/album/test', AlbumController.prueba);
api.post('/album/add/', md_auth0.ensureAuth0, AlbumController.saveAlbum);
api.put('/album/edit/:id', md_auth0.ensureAuth0, AlbumController.updateAlbum);
api.get('/album/get-by-id/:id', md_auth0.ensureAuth0, AlbumController.getAlbumById);
api.get('/album/get/:id?/:page?', md_auth0.ensureAuth0, AlbumController.getListaAlbumPage);
api.delete('/album/remove/:id', md_auth0.ensureAuth0, AlbumController.deleteAlbum);
api.post('/album/image/:id', [md_auth0.ensureAuth0, md_upload], AlbumController
  .setImageAlbum);
api.get('/album/getimage/:imageFile', AlbumController.getImageAlbum);
module.exports = api;
