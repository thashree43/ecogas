import { IUserRepository } from "../domain";
import { IUserData } from "../infrastructure/database";
import { User } from "../domain";
import { getUserFromGoogle} from "../infrastructure/utilis";
import {generatetoken} from "../interface/middleware/Authtoken"

export class GoogleAuthUseCase {
  constructor(private googlrepository: IUserRepository) {}

  async execute(token: string): Promise<{ success: boolean; token: string; refreshToken: string; user?: User }> {
    if (!token) {
      throw new Error("The token is required.");
    }

    try {
      console.log("Starting Google authentication with token:", token);

      // Retrieve user information from Google
      const { name, email, id } = await getUserFromGoogle(token);
      console.log("Retrieved user info from Google:", { name, email, id });

      // Attempt to find the user by email in the repository
      let userData: IUserData | null = await this.googlrepository.findbyEmail(email);
      let user: User;

      if (!userData) {
        console.log("User not found in the repository. Creating new user...");

        // Create a new user instance if not found
        user = new User({
          username: name,
          email: email,
          mobile: null,
          password: id, 
          is_blocked: false,
          is_admin: false,
          is_verified: true
        });

        // Save the new user instance
        userData = await this.googlrepository.saveuser(user);
        console.log("New user saved in the repository:", userData);
      } else {
        console.log("User found in the repository:", userData);
        user = new User(userData);
      }

      // Check if the user is blocked
      if (user.is_blocked) {
        console.error("User is blocked.");
        throw new Error("User is blocked.");
      }

      // Generate authentication tokens
      const newToken = generatetoken({ email });
      const refreshToken = generatetoken({ email });
      console.log("Generated tokens:", { newToken, refreshToken ,user});

      return { success: true, token: newToken, refreshToken, user };
    } catch (error) {
      console.error("Error in Google authentication use case:", error);
      throw error;
    }
  }
}
