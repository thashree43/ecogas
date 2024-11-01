import {DecodedToken} from "../interfacetypes/type"
import Cookies from 'js-cookie';  

const extractToken = (token: string): DecodedToken | null => {
    if (!token) {
        console.log("No token provided for extraction.");
        return null;
    }
    
    try {   
        const tokenPart = token.split(".")[1];
        if (!tokenPart) {
            console.error("Invalid token format");
            return null;
        }
        
        const decodedToken = JSON.parse(atob(tokenPart));
        console.log("Decoded token:", decodedToken);
        
        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
            console.log("Token has expired");
            Cookies.remove("userToken"); // Clean up expired token
            return null;
        }
        
        return decodedToken;
    } catch (error) {
        console.error("Error during token extraction:", error);
        return null;
    }
};

export default extractToken;