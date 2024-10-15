import { IadminRepository } from "../domain";
import { IMessageData } from "../domain/entities/messageentities";

export class SendMessageUseCase {
  private adminRepository: IadminRepository;

  constructor(adminRepository: IadminRepository) {
    this.adminRepository = adminRepository;
  }

  async execute(chatId: string, adminId: string, content: string): Promise<IMessageData> {
    return this.adminRepository.sendMessage(chatId, adminId, content);
  }
}