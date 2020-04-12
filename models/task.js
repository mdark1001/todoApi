'use strict'
var mongoose = require('mongoose');
var paginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var TaskSchema({
  name:String,
  createdAt: Date,
  description: String,
  userId:{
    type: Schema.ObjectId,
    ref: 'User',
  },
  projectId:{
    type: Schema.ObjectId,
    ref: 'Project',
  },
  dateDue:Date,
  priority: Number,
  userProperty:{
    type: Schema.ObjectId,
    ref: 'User',
  },
});
TaskSchema.statics.paginate = paginate;
module.exports = mongoose.model('Task',TaskSchema);
