import { IUserRepository } from "../domain";
import { Types } from "mongoose";

export class GetBookUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string) {
    const objectId = new Types.ObjectId(userId);
    const user = await this.userRepository.getbookbyid(objectId);
    return user ? user.book : null;
  }
}