// src/infrastructure/repository/interface/adminInterface.ts
import { IagentData, IOrderData, IUserData } from "../../infrastructure/database";

export interface IadminRepository {
    findbyEmail(email: string): Promise<IUserData | null>;
    getall(): Promise<IUserData[] | null>;
    updatestatus(id: string, data: object): Promise<IUserData | null>;
    getallagent(): Promise<IagentData[] | null>;
    updateApproval(id:string,data:object):Promise<IagentData | null>
    allorders(): Promise<IOrderData[]>;
}
