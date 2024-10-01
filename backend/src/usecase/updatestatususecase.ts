import { IUserData } from "../domain";
import { IUserRepository } from "../domain";

export class updateusecase {
    constructor(private userRepository: IUserRepository) {}

    async execute(id: string, data: object): Promise<IUserData | null> {
        const updatedUser = await this.userRepository.updatestatus(id, data);

        if (!updatedUser) {
            throw new Error("Error updating user status or user not found.");
        }

        return updatedUser;  
    }
}
