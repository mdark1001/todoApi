var express = require('express');

var ArtisController = require('../controllers/artis_controller');
var md_auth0 = require('../middelwares/auth0');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({
  uploadDir: './upload/artist'
});

api.get('/artist/test', ArtisController.test);
api.post('/artist/add', md_auth0.ensureAuth0, ArtisController.saveArtist);
api.get('/artist/get-by-id/:id', md_auth0.ensureAuth0, ArtisController.getSimpleArtistById)
api.put('/artist/update/:id', md_auth0.ensureAuth0, ArtisController.updateArtist);
api.get('/artist/:page?', md_auth0.ensureAuth0, ArtisController.getListArtisByPage);
api.delete('/artist/remove/:id', md_auth0.ensureAuth0, ArtisController.deleteArtist);
api.post('/artist/uploadimage/:id', [md_auth0.ensureAuth0, md_upload],
  ArtisController.uploadFile);

api.get('/artist/image/:imageFile', ArtisController.getImageUser);

module.exports = api;
