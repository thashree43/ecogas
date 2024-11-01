import extractToken from "./extracttoken";
import Cookies from "js-cookie";
import type { DecodedToken } from "../interfacetypes/type";

// Fallback function to get a cookie by name directly from document.cookie
const getCookieByName = (name: string): string | undefined => {
    const cookieMatch = document.cookie.match(`(^|;)\\s*${name}=([^;]+)`);
    return cookieMatch ? decodeURIComponent(cookieMatch[2]) : undefined;
};

import { useSelector } from 'react-redux';
import { RootState } from '../store/store'; // Adjust the import based on your store location

export const getToken = (name: string): DecodedToken | null => {
  try {
    // Use Redux to get the token
    const token = useSelector((state: RootState) => state.user.token);
    console.log("the token be this ",token);
    

    if (token) {
      const userDetail = extractToken(token);
      console.log("Extracted user details:", userDetail);
      return userDetail;
    }

    // Fallback to cookies
    const cookieToken = Cookies.get(name) || getCookieByName(name);

    if (!cookieToken) {
      console.log("No token found in cookies");
      return null;
    }

    const userDetail = extractToken(cookieToken);
    console.log("Extracted user details from cookie:", userDetail);
    return userDetail;
  } catch (error) {
    console.error("Error in getToken:", error);
    return null;
  }
};
