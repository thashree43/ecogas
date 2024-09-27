import { error } from "console";
import { agentModel, IagentData, IOrderData, orderModel } from "../../db";
import { IadminRepository } from "../interface/adminInterface";

export class AdminRepository implements IadminRepository {
  constructor() {}

  async getallagent(): Promise<IagentData[]> {
    try {
      return await agentModel.find();  // Fetching all agents from the database
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching agents");
    }
  }
  async updateApproval(id: string, data: object): Promise<IagentData | null> {
      try {
        const updateagentapproval = await agentModel.findOneAndUpdate({_id:id},data,{
            new:true
        })
        if (!updateagentapproval) {
            throw new Error("agent not found")
        }
        return updateagentapproval
      } catch (error) {
        throw new Error("there is some mistake may seems in while in the db model")
      }
  }
  async allorders(): Promise<IOrderData[]> {
    try {
      const data = await orderModel.find();
      return data;
    } catch (error) {
      console.error(error, "error occurred while getting orders");
      throw new Error("Error fetching orders");
    }
  }
  
}
