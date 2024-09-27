import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
require("dotenv").config()
// Function to generate an OTP
export const generateotp = (length: number = 4): string => {
    const digits: string = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
};

// Function to generate a JWT token
const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set.");
}


export const generatetoken = (payload: any, options?: SignOptions): string => {
    console.log("Payload:", payload, "Options:", options);
    
    return jwt.sign(payload, secret, {
        ...(options || {}), // Use an empty object if options is undefined
        expiresIn: '1h'
    });
};
