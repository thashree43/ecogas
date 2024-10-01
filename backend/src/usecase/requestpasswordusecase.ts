import { Otpservice } from "../infrastructure/service/Otpservice";
import { IRedisRepository, IUserRepository } from "../domain";
import { generatetoken } from "../interface/middleware/Authtoken";
require('dotenv').config(); // Ensure environment variables are loaded

export class RequestpasswordUsecase {
    constructor(
        private userRepository: IUserRepository,
        private redisRepository: IRedisRepository,
        private otpService: Otpservice
    ) {}

    async execute(email: string): Promise<{ success: boolean }> {
        console.log("Email received in the use case:", email);
        
        if (!email) {
            throw new Error("The email is not correct");
        }

        // Check if user exists
        const user = await this.userRepository.findbyEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        console.log("Processing password reset for user...");

        // Generate token with user's email as payload
        const token = generatetoken({ email });

        console.log("Generated reset token:", token);

        // Store the token in Redis with an expiration time of 1 hour
       const th= await this.redisRepository.store(token, email, 3600);

        // Create a reset link with the generated token
        const resetlink = `${process.env.CLIENT_URL}/updatepassword/${token}`;
        
        // Send reset email with the generated link
        await this.otpService.sendMail(email, "Password Reset", `Reset your password using this link: ${resetlink}`);

        return { success: true };
    }
}
