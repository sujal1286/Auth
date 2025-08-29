import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";



export const register = async (req, res) => {

     const {name , email , password} = req.body;
    
     if(!name || !email || !password){
        return res.status(400).json({message: "All fields are required"});
     }
     try {

        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password: hashPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});


        res.cookie('token', token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' ,maxAge: 1 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({message: "User registered successfully"});



    } catch (error) {
        res.json({message: error.message});
     }
}



export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({message: "Login successful"});
 
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token',{
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production',
           sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
        });
        return res.status(200).json({message: "Logout successful"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}