import { Types } from "mongoose";
import { IagentData } from "../infrastructure/db";
import { IAgentRepository } from "../infrastructure/repository";

export class getordersfromagentusecase {
  constructor(private AgentRepositories: IAgentRepository) {}

  async execute(agentId: Types.ObjectId | string): Promise<IagentData | null> {
    try {
      const result = await this.AgentRepositories.getordersin(agentId);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}