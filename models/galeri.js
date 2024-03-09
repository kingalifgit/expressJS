const express = require("express")
const mongoose = require("mongoose")

const galeriSchema = mongoose.Schema({
  file:{
    type: String,
    required: true
  },
  deskripsi:{
    type: String
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("Galeri", galeriSchema)