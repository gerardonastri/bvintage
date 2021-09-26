const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number,
    author: String,
    image: String,
    description: String,
    category: String
  });


  module.exports = mongoose.model('Product', ProductSchema)