'use strict'
var mongoose = require('mongoose');
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

module.exports = mongoose.model('Project',ProjectSchema);
