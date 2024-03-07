const express = require("express")
const mongoose = require("mongoose")

const marked = require("marked")
const slugify = require("slugify")

const userSchema  = mongoose.Schema({
  nama:{
    required: true,
    type: String
  },
  email:{
    required: true,
    type: String
  },
  username: {
    required: true,
    type: String
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  slug:{
    type: String,
    required: true,
    unique: true
  }
})

userSchema.pre("validate", function(next){
  if( this.nama ){
    this.slug = slugify(this.nama, {
      lower: true,
      strict: true
    })

    next()
  }
})

module.exports = mongoose.model("User", userSchema)