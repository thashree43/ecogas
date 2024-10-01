import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AgentRepository } from "../infrastructure/repository";

export class agentloginusecase {
  constructor(private agentRepository: AgentRepository) {}

  async execute(email: string, password: string) {
    console.log(`Executing login for email: ${email}`);

    try {
      const agent = await this.agentRepository.findemail(email);
      console.log(`Agent found: ${JSON.stringify(agent)}`);

      if (!agent) {
        return { success: false, message: "Agent not found" };
      }

      console.log(`Stored hashed password: ${agent.password}`);
      console.log(`Provided password: ${password}`);

      const isPasswordValid = await bcrypt.compare(password, agent.password);
      console.log(`Password valid: ${isPasswordValid}`);

      if (!isPasswordValid) {
        console.log("Invalid password");
        return { success: false, message: "Invalid credentials" };
      }

      if (!agent.is_Approved) {
        return { success: false, message: "Agent is not approved" };
      }

      const token = jwt.sign({ agentId: agent._id }, process.env.JWT_SECRET || "your_jwt_secret_key", {
        expiresIn: "1h",
      });
      console.log(`Generated token: ${token}`);

      return { success: true, agent, token };
    } catch (error) {
      console.error("Error during login:", error);
      return { success: false, message: "An error occurred during login" };
    }
  }
}
