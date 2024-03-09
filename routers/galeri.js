const express = require("express")
const galeri = express.Router()
const multer = require("multer")
const Galeri = require("./../models/galeri")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.deskripsi + '-' + Date.now() + ".jpg")
  }
});

const upload = multer({ storage });

galeri.get("/", (req, res)=>{
  res.render("galeri", {
    pageTitle: "Halaman galeri",
    layout: "layouts/mainLayouts"
  })
})

galeri.get("/add-foto", (req, res)=>{
  res.render("add-foto", {
    pageTitle: "Upload gambar" ,
    layout: "layouts/mainLayouts"
  })
})

galeri.post("/",upload. single('file'), async (req, res, next) =>{
  try {
    // Dapatkan informasi file yang diunggah
    const { originalname, filename, path: filePath } = req.file;
    
    // Simpan informasi galeri ke dalam database
    const galeri = new Galeri({
      file: req.body.file,
      deskripsi: req.body.deskripsi
    });
    
    // Simpan galeri ke dalam database
    const savedGaleri = await galeri.save();
    
    res.redirect("/galeri")
  } catch (error) {
    // Tangani kesalahan
    next(error);
  }
})

module.exports = galeri