import { Types } from "mongoose";
import {AgentRepository} from "../infrastructure/repository"

export class listingproductusecase{
constructor(private IAgentRepositories:AgentRepository){}

async execute(agentId: string):Promise<any>{
    const objectIdAgentId = new Types.ObjectId(agentId);

    const data = await this.IAgentRepositories.getallproduct(objectIdAgentId)
    if (!data) {
        throw new Error("Product not founded")
    }
    return data
}
}