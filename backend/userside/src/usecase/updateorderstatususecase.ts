import { Types } from "mongoose";
import { IOrderData } from "../entities";
import { IAgentRepository } from "../infrastructure/repository";

export class updateorderstatususecase {
  constructor(private AgentRepositories: IAgentRepository) {}

  async execute(id: Types.ObjectId | string): Promise<IOrderData | null> {
    try {
      const res = await this.AgentRepositories.updatestatus(id);
      return res;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}