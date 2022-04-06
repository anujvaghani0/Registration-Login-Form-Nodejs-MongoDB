const mongoose = require("mongoose");
const express = require("express");
const async = require("hbs/lib/async");
const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs/dist/bcrypt");
const bcrypt = require("bcryptjs");
const res = require("express/lib/response");
const employee = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    //  unique:true
  },
  age: {
    type: Number,
    required: true,
    // unique:true
  },
  password: {
    type: String,
    required: true,
    // unique:true
  },
  confirmpassword: {
    type: String,
    required: true,
    // unique:true
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

employee.methods.generateAuthToken = async function () {
  try {
    console.log(this._id);
    const token = jwt.sign(
      { _id: this._id },
      "anujvaghanianujvaghanianujvaghanianujvaghani",
      {
        expiresIn: "10 second",
      }
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    // console.log(token)
    return token;
  } catch (error) {
    res.send("the error part" + error);
  }
};

employee.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.password, 10);
      // this.confirmpassword=undefined;
  }
  next();
});

const register = new mongoose.model("register", employee);
module.exports = register;
