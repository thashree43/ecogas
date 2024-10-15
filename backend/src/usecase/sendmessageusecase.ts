import { Types } from "mongoose";
import { chat, IUserRepository } from "../domain";


export class sendmessageusecase{
    constructor(
private UserRepository:IUserRepository
    ){}

    async execute(content: string, chatid: Types.ObjectId | string, userId: Types.ObjectId | string) {
        const newMessageData = {
          sender: userId,
          content: content,
          chat: chatid,
        };
    
        const savedMessage= await this.UserRepository.saveMessage(newMessageData);
        await this.UserRepository.updateLatestMessage(chatid, savedMessage._id);
        return savedMessage;
      }


    
}