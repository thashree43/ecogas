import { ObjectId, Types } from "mongoose";
import { chat, IUserRepository } from "../domain";
import { userModel } from "../infrastructure/database";

export class sendmessageusecase {
  constructor(private UserRepository: IUserRepository) {}

  async execute(content: string, chatid: Types.ObjectId | string, userId: Types.ObjectId | string) {
    const recieverdata = await userModel.findOne({ is_admin: true });
    if (!recieverdata) {
      throw new Error("Admin user not found");
    }
    const id = recieverdata._id;
  
    const newMessageData = {
      reciever: [id],  // Make sure reciever is an array, as per your message schema
      sender: [userId],
      content: content,
      chat: [chatid],  // Ensure chat is also an array
    };
  
    const savedMessage = await this.UserRepository.saveMessage(newMessageData);
    await this.UserRepository.updateLatestMessage(chatid, savedMessage._id);
    return savedMessage;
  }
  
}
