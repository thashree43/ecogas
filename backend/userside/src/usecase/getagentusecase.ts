import { IadminRepository } from "../infrastructure/repository";

export class getagentusecase {
  constructor(private IAdminRepository: IadminRepository) {}

  async execute(): Promise<any> {
    const data = await this.IAdminRepository.getallagent();
    if (!data) {
      throw new Error("No agents found");
    }
    return data; 
  }
}
