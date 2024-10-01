import {IUserRepository} from "../domain" 
import { generatetoken } from "../interface/middleware/Authtoken";
import {verifypassword} from "../infrastructure/utilis" // Adjust import based on your file structure

export class loginusecase {
  constructor(private loginRepository: IUserRepository) {}

  async execute(email: string, password: string): Promise<any> {
    if (!email || !password) {
      return { success: false, message: "Email and password are required." };
    }

    const user = await this.loginRepository.findbyEmail(email);
    if (!user) {
      return { success: false, message: "User does not exist." };
    }

    if (user.is_blocked === true) {
      return { success: false, message: "User is blocked." };
    }

    const isPasswordValid = await verifypassword(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid password." };
    }

    const tokenPayload = { id: user._id, email: user.email }; // Adjust payload as needed
    const token = generatetoken(tokenPayload); 

    return { success: true, user: { ...user.toObject(), token }, token }; // Ensure user is converted to a plain object
  }
}
