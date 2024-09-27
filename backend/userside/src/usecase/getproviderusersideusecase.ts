import { IAgentRepository } from "../infrastructure/repository";
import { IagentData } from "../infrastructure/db";

export class GetProviderUserSideUseCase {
    constructor(
        private agentRepository: IAgentRepository
    ) {}

    async execute(pincode: string): Promise<IagentData[]> {
        const agentData = await this.agentRepository.findByPincode(pincode);
        console.log("the agent data",agentData);
        
        return agentData;
    
    }
}