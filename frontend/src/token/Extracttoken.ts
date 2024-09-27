const extractToken = (token: string): any => {
    if (!token) {
        console.log("No token provided for extraction.");
        return null;
    }

    try {
        const tokenPart = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded token part:", tokenPart);
        return tokenPart;  // Return the entire decoded payload
    } catch (error) {
        console.error("Error during token extraction:", error);
        return null;
    }
};

export default extractToken;