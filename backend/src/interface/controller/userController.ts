import { Response, Request, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import stripe from "../../infrastructure/utilis/stripe";
import { IUserData } from "../../domain";
import { generatetoken, generateRefreshToken } from "../middleware/authtoken"
import {
  signupusecase,
  VerifyOtpUseCase,
  ResentotpUseCase,
  loginusecase,
  RequestpasswordUsecase,
  GoogleAuthUseCase,
  Resetpasswordusecase,
  GetProviderUserSideUseCase,
  addbookusecase,
  GetBookUseCase,
  deletebookusecase,
  orderplaceusecase,
  listorderusersideusecase,
} from "../../usecase";
import { Types } from "mongoose";
export class userController {
  private readonly jwtsecret: string;
  private readonly jwtRefreshSecret: string;

  constructor(
    private signupusecase: signupusecase,
    private verifyOtpusecase: VerifyOtpUseCase,
    private loginUsecase: loginusecase,
    private googleauthusecase: GoogleAuthUseCase,
    private requestPassword: RequestpasswordUsecase,
    private resetPasswordUsecase: Resetpasswordusecase,
    private resentOtpUseCase: ResentotpUseCase,
    private getProviderUseCase: GetProviderUserSideUseCase,
    private AddingBookUseCase: addbookusecase,
    private GetBookUseCases: GetBookUseCase,
    private DeleteBookUseCase: deletebookusecase,
    private OrderPlaceUseCase: orderplaceusecase,
    private Listordersusecase: listorderusersideusecase
  ) {
    const secret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!secret || !refreshSecret) {
      throw new Error("JWT secrets (access/refresh) are not set in environment variables");
    }

    this.jwtsecret = secret;
    this.jwtRefreshSecret = refreshSecret;
  }

  // Function to verify and decode the token
  private verifyToken(token: string): { id: string; email: string; iat: number; exp: number } {
    try {
      return jwt.verify(token, this.jwtsecret) as { id: string; email: string; iat: number; exp: number };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      }
      throw error;
    }
  }

  // {USER SIDE --------------------------------------------------------------------------}

  // User register
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, email, mobile, password } = req.body;
    try {
      const user = await this.signupusecase.execute(username, email, mobile, password);
      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  // OTP section
  async verifyotp(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { otp, email } = req.body;
    try {
      const response = await this.verifyOtpusecase.execute(otp, email);
      if (response.success) {
        res.cookie("userToken", response.token, { maxAge: 60 * 60 * 1000, httpOnly: true, sameSite: "strict" });
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async resendotp(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;
    try {
      await this.resentOtpUseCase.execute(email);
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  // User login part
  async loginuse(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    try {
      const response = await this.loginUsecase.execute(email, password);
      if (response.success) {
        const token = generatetoken({ id: response.user._id, email }); // Use _id instead of _is
        const refreshtoken = generateRefreshToken({ id: response.user._id, email });
        
        res.cookie("userToken", token, {
          maxAge: 60 * 60 * 1000, // 1 hour
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === 'production',
        });
        
        res.cookie("userrefreshToken", refreshtoken, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === 'production',
        });
  
        res.status(200).json({ success:true,user: response.user, token, refreshtoken });
      } else {
        res.status(400).json({ success: false, message: response.message });
      }
    } catch (error) {
      next(error);
    }
  }
  
  async userrefreshtoken(req: Request, res: Response, next: NextFunction) {
    const refreshToken = req.cookies.userrefreshToken; 
    if (!refreshToken) {
      return res.status(403).json({ message: 'Refresh token not provided' });
    }
  
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      const decoded = secret ? jwt.verify(refreshToken, secret) as JwtPayload : null;
  
      if (!decoded || !decoded.id || !decoded.email) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
      }
  
      // Generate new access token and refresh token
      const newAccessToken = generatetoken({ id: decoded.id, email: decoded.email });
      const newRefreshToken = generateRefreshToken({ id: decoded.id, email: decoded.email });
  
      // Set new tokens in cookies
      res.cookie("userToken", newAccessToken, { maxAge: 1 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
      res.cookie("userrefreshToken", newRefreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
  
      res.status(200).json({ success: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.error('Error refreshing token:', error); // Log the error
      res.status(500).json({ message: 'Internal server error' }); // Generic message to prevent leaking info
      next(error);
    }
  }
  
  
  async googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { postData } = req.body;
    try {
      const response = await this.googleauthusecase.execute(postData);
      if (response.success && response.user) { // Ensure user is defined
        const token = generatetoken({ id: response.user._id, email: response.user.email }); // Use response.user.email
        const refreshtoken = generateRefreshToken({ id: response.user._id, email: response.user.email });
  
        res.cookie("userToken", token, {
          maxAge: 1 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === 'production',
        });
        
        res.cookie("userrefreshToken", refreshtoken, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "strict",
        });
        
        res.status(200).json({ success: true, user: response.user ,token,refreshtoken});
      } else {
        res.status(401).json({ success: false, message: "Authentication failed" });
      }
    } catch (error) {
      res.status(401).json({ success: false, message: "Authentication failed" });
      next(error);
    }
  }
  

  // Password reset part
  async forgetpassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email } = req.body;
    try {
      const response = await this.requestPassword.execute(email);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async resetpassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { newPassword, token } = req.body;
      if (!token || !newPassword) {
        throw new Error("Token or password is missing.");
      }
      const response = await this.resetPasswordUsecase.execute(token, newPassword);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getprovider(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pincode = req.params.pincode;
      const token = req.cookies.userToken;
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      const decodedToken = this.verifyToken(token);
      const providers = await this.getProviderUseCase.execute(pincode);

      if (providers.length === 0) {
        res.status(404).json({ message: "No providers found for this pincode" });
      } else {
        res.status(200).json(providers);
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // addbook
  async addbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name, consumerId, mobile, address, company, gender } = req.body;
    try {
      const token = req.cookies.userToken;
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      const decodedToken = this.verifyToken(token);
      const userId = decodedToken.id;

      const bookData = await this.AddingBookUseCase.execute(
        userId, name, consumerId, mobile, address, company, gender
      );

      res.status(201).json({ bookData, success: true, message: "The book added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error adding the book" });
      next(error);
    }
  }

  async getbook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.params.userId;
      console.log(userId,"the od fpr yhe user ");
      
      if (!Types.ObjectId.isValid(userId)) {
        res.status(400).json({ success: false, message: "Invalid user ID format" });
        return;
      }

      const books = await this.GetBookUseCases.execute(userId);
      
      if (books) {
        res.status(200).json({ success: true, books });
      } else {
        res.status(404).json({ success: false, message: "User or books not found" });
      }
    } catch (error) {
      console.error("Error in getbook:", error);
      if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: "An unexpected error occurred" });
      }
    
    }}


  async deletebook(req: Request, res: Response, next: NextFunction): Promise<void> {
    const bookId = req.params.bookid;
    const token = req.cookies.userToken;
    try {
      const decodedToken = this.verifyToken(token);
      await this.DeleteBookUseCase.execute(bookId);
      res.status(200).json({ success: true, message: "The book has been deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting the book" });
      next(error);
    }
  }

  // ORDER SIDE

  // order placed
  async orderplace(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { selectedProviderId, customerDetails, paymentMethod, selectedGas } = req.body;
    console.log("the data reached in the controler");
    
    const token = req.cookies.userToken;
    try { 
      const decodedToken = this.verifyToken(token);
      const userId = decodedToken.id;
      console.log(userId,"the userId may be here ");
      

      const response = await this.OrderPlaceUseCase.execute(userId, selectedProviderId, customerDetails, paymentMethod, selectedGas);
console.log(response);
console.log(response.success);


      if (response.success) {
        res.status(200).json({ success: true, message: "Order placed successfully" });
      } else {
        res.status(400).json({ success: false, message: "Order failed" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error placing the order" });
      next(error);
    }
  }

  // user list orders
  async listorderuserside(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies.userToken;
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      const decodedToken = this.verifyToken(token);
      const userId = decodedToken.id;

      const orders = await this.Listordersusecase.execute(userId);
      if (orders) {
        res.status(200).json(orders);
      } else {
        res.status(404).json({ success: false, message: "No orders found" });
      }
    } catch (error) {
      next(error);
    }
  }
}
