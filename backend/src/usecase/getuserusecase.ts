import { IUserRepository } from "../domain";

export class getuserusecase {
  constructor(private userRepository: IUserRepository) {}
  async execute(): Promise<any> {
    const data = await this.userRepository.getall();

    if (!data) {
      throw new Error("Error has been occures");
    }
    return data;
  }
}
