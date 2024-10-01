import { AgentRepository } from "../infrastructure/repository";
import { Agent, IagentData } from "../domain";
import { hashPassword } from "../infrastructure/utilis"; 


export class Agentapplyusecase {
    constructor(
        private agentRepository: AgentRepository
    ) {}

    async applyAgent(agentData: {
        agentname: string;
        email: string;
        mobile: string;
        password: string;
        pincode: string;
        image: string;
    }): Promise<Agent> {

        const haashedpassword = await hashPassword(agentData.password)
        // Create a new Agent instance
        const newAgent = new Agent({
            agentname: agentData.agentname,
            email: agentData.email,
            mobile: parseInt(agentData.mobile),
            password: haashedpassword,
            pincode: parseInt(agentData.pincode),
            image: agentData.image
        });

        // Save the agent using the repository
        const savedAgent = await this.agentRepository.saveagent(newAgent);

        // Return the saved agent data
        return new Agent(savedAgent  as IagentData);
    }
}