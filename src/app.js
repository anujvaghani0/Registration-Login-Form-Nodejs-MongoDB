const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const path = require("path");
const hbs = require("hbs");
require("../src/db/conn");
// const registerss=require("./models/registers")
const register = require("./models/registers");
const async = require("hbs/lib/async");
// const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const template_path_partials = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(template_path_partials);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});

// register
app.post("/register", async (req, res) => {
  try {
    const passwrod = req.body.password;
    const cpasswrod = req.body.confirmpassword;

    if (passwrod == cpasswrod) {
      const registerEmployee = new register({
        firstname: req.body.firstname,
        email: req.body.email,
        phone: req.body.phone,
        age: req.body.age,
        password: passwrod,
        confirmpassword: cpasswrod,
      });

      // token
      const token = await registerEmployee.generateAuthToken();
      const registered = await registerEmployee.save();
      res.status(201).render("index");
    } else {
      res.send("password no matching");
      // res.status(201).render("index");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

//  login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await register.findOne({ email: email });
    
    const isMatch = await bcrypt.compare(password, useremail.password);
    const token = await useremail.generateAuthToken();
    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.status(201).send("password not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

const securepassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  // console.log(passwordHash);

  // const passwordMatch=await bcrypt.compare("anuj11233",passwordHash);
  // console.log(passwordMatch);
};

// jsonwebtoken

// const cretetoken=async()=>{
// const token  = await jwt.sign({_id:"624d6bd11fd80371a0549487"},'anujvaghanianujvaghanianujvaghanianujvaghani',{
//   expiresIn:"2 second"
// })

// console.log(token);

// const userVal=await jwt.verify(token,'anujvaghanianujvaghanianujvaghanianujvaghani')
// console.log(userVal)
// }
// cretetoken();



app.listen(port, () => {
  console.log(`sucessfully running in ${port}`);
});
