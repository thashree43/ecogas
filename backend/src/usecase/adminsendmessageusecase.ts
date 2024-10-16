import { IadminRepository } from "../domain";
import { IMessageData } from "../domain/entities/messageentities";
import { ChatModel } from "../infrastructure/database";

export class SendMessageUseCase {

  constructor(
    private adminRepository: IadminRepository) {
  }

  async execute(chatId: string, adminId: string, content: string): Promise<IMessageData> {
    const recieverdata = await ChatModel.findOne({_id:chatId})
    const id = recieverdata?.user
    console.log(id,"the recieverid");
    
  const newMessgeData = {
    reciever:id,
    sender:adminId,
    content:content,
    chat:chatId
  } 
  const savedMessage = await this.adminRepository.saveMessage(newMessgeData)
    await this.adminRepository.updateLatestMessage(chatId, savedMessage._id);
    return savedMessage;
  }
}