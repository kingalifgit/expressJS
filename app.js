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

app.post("/user", async (req, res) => {
  let user = new User({
    nama: req.body.nama,
    email: req.body.email,
    username: req.body.username
  })
  try{
    user = await user.save()
    res.redirect(`/user/${user.slug}`)
    console.log(user.id)
  }catch(e){
    console.log(e)
    res.render("add-user", {
      user,
      layout: ("layouts/mainLayouts"),
      pageTitle: "Tambah user"
    })
  }

})

app.delete("/user/:id", async (req, res)=>{
  await User.findByIdAndDelete(req.params.id)
  res.redirect("/user")
})


app.use(express.static("public"))
app.listen("3200")
console.log("http://127.0.0.1:3200/")