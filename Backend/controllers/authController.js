import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";



export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        // OTP valid for 24 hours
        const otpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        const user = new userModel({
            name,
            email,
            password: hashPassword,
            verifyOtp: otp,
            verifyOtpExpireAt: otpExpireAt,
            isAccountVerified: false
        });
        await user.save();
        // Send OTP email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Verify Your Email',
            text: `Your verification OTP is ${otp}`
        };
        await transporter.sendMail(mailOptions);
        return res.status(201).json({
            message: "OTP sent to email. Please verify to complete registration.",
            userId: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        return res.status(200).json({
            message: "Login successful",
            userId: user._id
        });
 
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

// send verification OTP to the user's email 
// sendVerifyOtp can be kept for other flows (like re-sending OTP), but not needed for registration anymore


export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isAccountVerified) {
            return res.status(400).json({ message: "Account already verified" });
        }
        if (user.verifyOtp === '') {
            return res.status(401).json({ message: "No OTP found. Please request a new OTP" });
        }
        if (Date.now() > user.verifyOtpExpireAt) {
            return res.status(401).json({ message: "OTP expired" });
        }
        if (String(user.verifyOtp) !== String(otp)) {
            return res.status(401).json({ message: "Invalid OTP" });
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        // Optionally, send welcome email here
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Welcome to Our Auth Platform',
            text: `Hello, ${user.name}, your email ${user.email} has been successfully registered. Thank you for registering with us!`
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}