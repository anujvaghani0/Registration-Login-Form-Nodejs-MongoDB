const mongoose=require("mongoose");
const express=require("express");
const async = require("hbs/lib/async");

// const bcrypt = require("bcryptjs/dist/bcrypt");
const bcrypt = require("bcryptjs");
const employee = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    email:{
       type:String,
       required:true
    },
     phone:{
        type:Number,
        required:true,
        unique:true
     },
     age:{
        type:Number,
        required:true,
        // unique:true
     },
     password:{
        type:String,
        required:true,
        // unique:true
     },
     confirmpassword:{
        type:String,
        required:true,
        // unique:true
     }
})

employee.pre("save",async function(next){
   // console.log(`The Current password is ${this.password}`)
   if(this.isModified("password")){
     this.password=await bcrypt.hash(this.password,10);
   //   console.log(`the current password is ${this.password}`);
}
// this.confirmpassword=undefined;
   next();
})




const register=new mongoose.model("register",employee);
module.exports=register;