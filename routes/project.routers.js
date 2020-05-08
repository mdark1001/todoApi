var express = require('express');

var ProjectController = require('../controllers/ProjectController');
var md_auth0 = require('../middelwares/auth0');
var api = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({
    uploadDir: './upload/projects'
});

api.get('/project/test', ProjectController.test);
api.post('/project/', md_auth0.ensureAuth0, ProjectController.create);
api.get('/project/:page?',md_auth0.ensureAuth0,ProjectController.list)
//api.put('/artist/update/:id', md_auth0.ensureAuth0, ProjectController.updateArtist);
//api.get('/artist/:page?', md_auth0.ensureAuth0, ProjectController.getListArtisByPage);
//api.delete('/artist/remove/:id', md_auth0.ensureAuth0, ProjectController.deleteArtist);
//api.post('/artist/uploadimage/:id', [md_auth0.ensureAuth0, md_upload],ProjectController.uploadFile);

//api.get('/artist/image/:imageFile', ProjectController.getImageUser);

module.exports = api;
