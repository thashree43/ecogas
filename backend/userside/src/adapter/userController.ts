import { Response, Request, NextFunction } from "express";
import {
  signupusecase,
  VerifyOtpUseCase,
  loginusecase,
  RequestpasswordUsecase,
  GoogleAuthUseCase,
  Resetpasswordusecase,
  Adminloginusecase,
  getuserusecase,
  updateusecase,
  GetProviderUserSideUseCase,
  addbookusecase,
  GetBookUseCase,
  deletebookusecase,
  orderplaceusecase,
  listorderusersideusecase
} from "../usecase";
import { ResentotpUseCase } from "../usecase/resentotpusecase";
import { getDiffieHellman } from "crypto";
import jwt from "jsonwebtoken";
import stripe from "../utilis/stripe"
import { IUserData } from "../entities";

export class userController {
  private jwtsecret!: string;
  constructor(
    private signupusecase: signupusecase,
    private verifyOtpusecase: VerifyOtpUseCase,
    private loginUsecase: loginusecase,
    private googleauthusecase: GoogleAuthUseCase,
    private requestPassword: RequestpasswordUsecase,
    private resetPasswordUsecase: Resetpasswordusecase,
    private resentOtpUseCase: ResentotpUseCase,
    private adminloginUsecase: Adminloginusecase,
    private getUserusecase: getuserusecase,
    private updateUseCase: updateusecase,
    private getProviderUseCase: GetProviderUserSideUseCase,
    private AddingBookUseCase: addbookusecase,
    private GetBookUseCases: GetBookUseCase,
    private DeleteBookUseCase: deletebookusecase,
    private OrderPlaceUseCase:orderplaceusecase,
    private Listordersusecase:listorderusersideusecase
  ) {
    this.jwtsecret = process.env.JWT_SECRET || "default_jwt_secret";
  }
  
  // {USER SIDE --------------------------------------------------------------------------}
  // User register part
  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { username, email, mobile, password } = req.body;

    console.log(req.body);

    try {
      const user = await this.signupusecase.execute(
        username,
        email,
        mobile,
        password
      );
      console.log("this be the userdatas as", user);

      res.status(200).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  // OTP section
  async verifyotp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { otp, email } = req.body;

    console.log(req.body, "uiuiuiuiuiuiu");

    try {
      const response = await this.verifyOtpusecase.execute(otp, email);
      if (response.success) {
        res.cookie("userToken", response.token, {
          maxAge: 60 * 60 * 1000,
        });
      }
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async resendotp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body;
    console.log("the email for resentotp", email);

    try {
      res.status(200).json({ success: true });
      await this.resentOtpUseCase.execute(email);
    } catch (error) {
      next(error);
    }
    console.log("the resend otp be this", req.body);
  }

  // User login part
  async loginuse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;
    console.log("the data from the login body", req.body);

    try {
      const response = await this.loginUsecase.execute(email, password);
      if (response.success) {
        res.cookie("userToken", response.token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        });
        res.status(200).json(response.user);
      } else {
        res.status(400).json({ success: false, message: response.message });
      }
    } catch (error) {
      next(error);
    }
  }

  // Google Authentication part
  async googleAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { postData } = req.body;

    try {
      const response = await this.googleauthusecase.execute(postData);
      if (response.success) {
        res.cookie("userToken", response.token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
        });
        res.status(200).json({ success: true, user: response.user });
      }
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }
  }

  // password reset part
  async forgetpassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email } = req.body;
    console.log("forget paassword email", email);
    try {
      const response = await this.requestPassword.execute(email);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async resetpassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { newPassword, token } = req.body;

      console.log("The new password to be like this:", newPassword);
      console.log("Extracted token:", token);

      if (!token || !newPassword) {
        throw new Error("Token or password is missing.");
      }

      const response = await this.resetPasswordUsecase.execute(
        token,
        newPassword
      );
      res.status(200).json(response);
    } catch (error) {
      console.error("Error in resetpassword controller:", error);
      next(error);
    }
  }

  async getprovider(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const pincode = req.params.pincode;
      const token = req.cookies.userToken;

      const decodtoken = jwt.verify(token, this.jwtsecret) as {
        id: string;
        email: string;
        iat: number;
        exp: number;
      };

      const userId = decodtoken.id;

      if (!pincode) {
        res.status(400).json({ error: "Pincode is required" });
        return;
      }

      const providers = await this.getProviderUseCase.execute(pincode);

      if (providers.length === 0) {
        res
          .status(404)
          .json({ message: "No providers found for this pincode" });
      } else {

        res.status(200).json(providers);
      }
    } catch (error) {
      console.error("Error in getprovider:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // admin login
  async adminlogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { email, password } = req.body;

    try {
      const response = await this.adminloginUsecase.execute(email, password);

      if (response.success) {
        res.cookie("adminToken", response.token, {
          maxAge: 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
        });
        console.log("The token from the response:", response.token);

        res.status(200).json({
          success: true,
          admin: response.admin,
          token: response.token,
        });
      } else {
        res.status(401).json({ success: false, message: response.message });
      }
    } catch (error) {
      next(error);
    }
  }

  // Listing Users in adminside
  async getusers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await this.getUserusecase.execute();

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  // Block & Unblock
  async updatestatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { is_blocked } = req.body;

    if (!id) {
      res.status(400).json({ success: false, message: "User ID not provided" });
      return;
    }

    try {
      const updatedUser = await this.updateUseCase.execute(id, { is_blocked });

      if (!updatedUser) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      console.log("User status updated:", updatedUser);
      res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
      console.error("Error updating user status:", error);
      next(error);
    }
  }

  // addbook
  async addbook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { name, consumerId, mobile, address, company, gender } = req.body;
    try {
      const token = req.cookies.userToken;
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      const decodedToken = jwt.verify(token, this.jwtsecret) as {
        id: string;
        email: string;
        iat: number;
        exp: number;
      };

      const userId = decodedToken.id;

      console.log("The userId may be here:", userId);

      if (!userId) {
        throw new Error("User ID is not available in the token");
      }

      const bookData = await this.AddingBookUseCase.execute(
        userId,
        name,
        consumerId,
        mobile,
        address,
        company,
        gender
      );
      console.log("the book added successfully");
      res
        .status(201)
        .json({
          bookData,
          success: true,
          message: "the book added successfully",
        }); // Respond with the created book data
    } catch (error) {
      console.error("Error seems here:", error);
      res.status(500).json({ message: "errors seems here" });
      next(error); // Pass the error to the next middleware
    }
  }
  async getbook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.userId;
      console.log("userId may from the getbook", userId);

      const books = await this.GetBookUseCases.execute(userId);
      console.log(books, "the bookdata");

      if (books) {
        console.log("success book is here");

        res.status(200).json({ success: true, books });
      } else {
        res
          .status(404)
          .json({ success: false, message: "User or books not found" });
      }
    } catch (error) {
      next(error);
    }
  }

  async deletebook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const bookId = req.params.bookid;
    const token = req.cookies.userToken;
    console.log(bookId, "bookid for deleting the book");
    console.log(token, "to delete the bok from tyheusee");

    try {
      const decodetoken = jwt.verify(token, this.jwtsecret) as {
        id: string;
        email: string;
        iat: number;
        exp: number;
      };

      const userId = decodetoken.id;
      console.log(userId, "while  deleting the boook");
      const result = await this.DeleteBookUseCase.execute(bookId);
      console.log("the book has been deleted");
      res
        .status(200)
        .json({ success: true, result, message: "the book has been deleted" });
    } catch (error) {
      console.error("error occured while deleting the book");
    }
  }
  async ordergas(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { selectedProviderId, customerDetails, paymentMethod, selectedGas } = req.body;
    const token = req.cookies.userToken;
   

    console.log("Selected Provider ID:", selectedProviderId);
    console.log("Customer Details:", customerDetails);
    console.log("Payment Method:", paymentMethod);
    console.log("Selected Gas:", selectedGas);

    try {
      const decoToken = jwt.verify(token, this.jwtsecret) as {
        id: string;
        email: string;
        iat: number;
        exp: number;
      };

      const userId = decoToken.id;
      const order = await this.OrderPlaceUseCase.execute(
        userId,
        selectedProviderId,
        customerDetails,
        paymentMethod,
        selectedGas
      );
      const amountInPaise = order.price * 100; 
      console.log(amountInPaise,"the amount while placing th oerder");
      
            if (amountInPaise < 50) {
                res.status(400).json({ message: "Amount must be at least 50 paise (0.50 INR)." });
                return;
            }
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInPaise,
                currency: 'inr',
                payment_method_types: ['card'],
            });
            console.log(paymentIntent.client_secret); 
            
            res.status(200).send({
                clientSecret: paymentIntent.client_secret,
              });
      console.log("The order successfully placed");
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "The order placement failed" });
    }
  }  
      async getorders(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id;
        console.log("the id to listout the orders", id);
        try {
          const userData: IUserData = await this.Listordersusecase.execute(id);
          res.status(200).json({ success: true, orders: userData.orders });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: "Error fetching orders" });
        }
  }
}
