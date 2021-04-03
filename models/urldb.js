const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const timezone = require('mongoose-timezone');

const UrldbSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    //trim: true,
    index: true
  },
  urls:[{
    name:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    url: {
        type: String,
        required: true,
    },
    count:{
        type: Number,
        default:0
    }
  }]
});

UrldbSchema.plugin(timestamp);
UrldbSchema.plugin(timezone);

const UrlDB = mongoose.model('UrlDB', UrldbSchema,'urldb');
module.exports = UrlDB;