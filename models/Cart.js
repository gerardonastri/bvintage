const mongoose = require('mongoose');

const Cartschema = new mongoose.Schema({
    name: String,
     price: Number,
     quantity: Number,
     image: String

  });


  module.exports = mongoose.model('Cart', Cartschema)