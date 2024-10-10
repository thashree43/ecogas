import { error } from "console";
import { agentModel, IagentData, IOrderData, IUserData, orderModel, userModel } from "../database";
import { IadminRepository } from "../../domain";

export class AdminRepository implements IadminRepository {
  constructor() {}
  async findbyEmail(email: string): Promise<IUserData | null> {
    return (await userModel.findOne({ email })) as IUserData;
  }
  async getall(): Promise<IUserData[] | null> {
    try {
      return await userModel.find().lean<IUserData[]>();
      console.log("hello here reached");
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  async updatestatus(id: string, data: object): Promise<IUserData | null> {
    try {
      const updateduser = await userModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });
      if (!updateduser) {
        throw new Error("the user may not found ");
      }
      return updateduser;
    } catch (error) {
      throw new Error("error in db while updating status in blocking the user");
    }
  }
 

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
