import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { json } from "express";

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
}

// Route for user login
const loginUser = async(req, res) => {
    try {
        const{email , password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({ success:false ,message : "User not found"});
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(isMatch){
            const token = createToken(user._id);
            res.json({success:true , token});
        }else{
            return res.status(400).json({ success:false ,message : "Invalid credentials"});
        }
         
    } catch (error) {
        console.log(error);
        res.json({success:false , message : error.message});
        
    }
}

// Route for user registration
const registerUser = async(req, res) => {
    try {
        
        const {name , email , password} = req.body;
        // checking user already exist or not 
        const exists = await userModel.findOne({email});
        if(exists){
            return res.status(400).json({ success:false ,message : "User already exists"});
        }
        // validating email formate & strong password 
        if(!validator.isEmail(email)){
            return res.status(400).json({ success:false ,message : "Invalid email"});
        }
        if(password.length < 8){
            return res.status(400).json({ success:false ,message : "Password should be strong"});
        }

        // hashing password by bycrpt
         const salt = await bcrypt.genSalt(10);
         const hashPassword = await bcrypt.hash(password,salt);

         const newUser = new userModel({
            name , 
            email , 
            password : hashPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true , token});
       
    } catch (error) {
        console.log(error);
        res.json({success:false , message : error.message});
        
    }
}

// Route for admin login
const adminLogin = async(req, res) => {
    try {
        const {email,password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            res.json({success:true , token});
        }
        else{
            return res.status(400).json({ success:false ,message : "Invalid credentials"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false , message : error.message});
        
    }
}


export {
    loginUser,
    registerUser,
    adminLogin
}