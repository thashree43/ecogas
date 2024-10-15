// src/infrastructure/repository/interface/adminInterface.ts
import { IagentData, IMessageData, IOrderData, IUserData } from "../../infrastructure/database";
import { IChatData } from "../entities/chatentities";

export interface IadminRepository {
    findbyEmail(email: string): Promise<IUserData | null>;
    getall(): Promise<IUserData[] | null>;
    updatestatus(id: string, data: object): Promise<IUserData | null>;
    getallagent(): Promise<IagentData[] | null>;
    updateApproval(id:string,data:object):Promise<IagentData | null>
    allorders(): Promise<IOrderData[]>;
    getcustomers():Promise<IChatData[] | null>
    getMessages(chatId: string): Promise<IMessageData[]>;
    sendMessage(chatId: string, adminId: string, content: string): Promise<IMessageData>;
}
