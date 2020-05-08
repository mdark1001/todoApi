'use strict'
var fs = require('fs');
var services_user = require('../services/user.services');
const Response = require('../services/response.js');
var Project = require('../models/projects');
const UPLOAD_PATH = './upload/projects/';
var mongoosePaginate = require('mongoose-pagination');
let ProjectController = {

    create: function (req, res) {
        let project = new Project()
        let params = req.body;


        if (params.title && params.userId) {

            project.title = params.title
            project.description = params.description
            project.userId = params.userId
            project.createdAt = new Date()
            project.priority = params.priority
            project.save((err, _project) => {
                if (err) {
                    Response.badResponse(res, 'No es posible crear el proyecto');
                } else {
                    Response.makeResponse(res, 200, {
                        message: 'Se creó correctamente el proyecto',
                        project: _project
                    });
                }

            })


        } else {

            Response.makeResponse(res, 500, {message: 'No es posible crear el proyecto sin un usuario responsable'})
        }

    },
    list: function (req, res) {
        let page = req.params.page || 1;
        let items = req.params.items || 10
        Project.find().sort('createdAt').paginate(page, items, (err, _projects, _items) => {
            if (err)
                Response.badResponse(res, 'Ocurrio un error al procesar su solicitud');

            if (!_projects) {
                Response.makeResponse(res, 404, {message: 'Sin projectos que mostrar'})
            } else {
                Response.makeResponse(res, 200, {
                    message: 'Todo bien',
                    projects: _projects,
                    pages: _items
                })
            }
        });

    },
    test: function (req, res) {
        Response.makeResponse(res, 200, {message: 'Todo bien'})
    }


};

module.exports = ProjectController