import extractToken from "./extracttoken"
import Cookies from "js-cookie"

export const getToken = (name:string)=>{
    const token = Cookies.get(name)
    console.log("the token in the gettoken",token);
    

    const userDetail = extractToken(token as string)
    return userDetail || null;
}
