const express = require("express")
const expLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const app = express()
const methodOverride = require('method-override')

// MODELS
const User = require("./models/user")


app.set("view engine", "ejs")
app.use(expLayouts)

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: false}))

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true

})

//Router
const galeri = require("./routers/galeri")
app.use("/galeri", galeri)

app.get("/", (req, res)=>{
  const local = {
    nama: "alif rahman",
    pageTitle : "Beranda",
    layout: "layouts/mainLayouts"
  }
  res.render("index", local)
})

app.get("/user", async (req, res)=>{
  const user = await User.find().sort({createAt: "desc"})

  const local = {
    layout: "layouts/mainLayouts",
    pageTitle: "Users",
    user
  }
  res.render("users", local)
})

app.get("/user/add-user", (req, res) => {
  const local = {
    layout: "layouts/mainLayouts",
    pageTitle: "Tambah user",
    user: new User()
  }
  res.render("add-user", local)
}) 

app.get("/user/:slug", async (req, res)=>{
  const user = await User.findOne({ slug: req.params.slug })

  if( user == null ) res.redirect("/")

  res.render("info", {
    user,
    layout: "layouts/mainLayouts",
    pageTitle: "Detail user"
  })
})

app.get("/edit/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
  const local = {
    pageTitle: "Edit user",
    layout: "layouts/mainLayouts",
    user
  }
  res.render("edit", local)
})

app.post("/user", async (req, res, next) => {
 req.user = new User()
 next()
}, saveUser("new"))

app.put("/user/:id", async (req, res, next) => {
 req.user = await User.findById(req.params.id)
 next()
}, saveUser("new"))

app.delete("/user/:id", async (req, res)=>{
  await User.findByIdAndDelete(req.params.id)
  res.redirect("/user")
})

function saveUser(path){
  return async (req, res) => {
    let user = req.user
      user.nama = req.body.nama
      user.email = req.body.email
      user.username = req.body.username
    
    try{
      user = await user.save()
      res.redirect(`/user`)
    }catch(e){
      console.log(e)
      res.render("add-user", {
        user,
        layout: ("layouts/mainLayouts"),
        pageTitle: "Tambah user"
      })
    }
  }
}


app.use(express.static("public"))
app.listen("3200", (req, res) =>{
  console.log("Server jalan di ip: http://127.0.0.1:3200/")
})