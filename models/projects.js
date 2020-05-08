'use strict'
var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var ProjectSchema = Schema({
  title: String,
  description: String,
  userId:{
    type: Schema.ObjectId,
    ref: 'User',
  },
  createdAt: Date,
  priority: Number,

});

ProjectSchema.statics.paginate = paginate;

module.exports = mongoose.model('Project',ProjectSchema);
