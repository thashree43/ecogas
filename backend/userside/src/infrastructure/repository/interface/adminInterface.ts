// src/infrastructure/repository/interface/adminInterface.ts
import { IagentData, IOrderData } from "../../db";

export interface IadminRepository {
    getallagent(): Promise<IagentData[] | null>;
    updateApproval(id:string,data:object):Promise<IagentData | null>
    allorders(): Promise<IOrderData[]>;
}
