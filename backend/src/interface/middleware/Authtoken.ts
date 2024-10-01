import jwt, { SignOptions } from "jsonwebtoken";
require("dotenv").config()


// Function to generate a JWT token
const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set.");
}


export const generatetoken = (payload: any, options?: SignOptions): string => {
    console.log("Payload:", payload, "Options:", options);
    
    return jwt.sign(payload, secret, {
        ...(options || {}), 
        expiresIn: '1h'
    });
};