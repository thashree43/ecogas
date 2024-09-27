import { Schema, Types } from "mongoose";
import { Agent, AgentProduct } from "../../../entities";
import { IagentData, IOrderData, IProductDocument, IUserData } from "../../db";

export interface IAgentRepository {
  saveagent(agent: Agent): Promise<IagentData>;
  findemail(email: string): Promise<IagentData | null>;
  findByPincode(pincode: string): Promise<IagentData[]>;
  addproduct(productData: AgentProduct, agentId: string): Promise<IProductDocument | null>;
  getallproduct(agentId: Types.ObjectId): Promise<IProductDocument[] | null>;
  findbyid(_id: Schema.Types.ObjectId): Promise<IProductDocument | null>;
  updateProduct(id: string | Types.ObjectId, productData: Partial<IProductDocument>): Promise<IProductDocument | null>;
  deleteproduct(id: string | Types.ObjectId): Promise<IProductDocument | null>;
  getordersin(agentId: Types.ObjectId | string): Promise<IagentData | null>;
  updatestatus(id:Types.ObjectId | string):Promise<IOrderData | null>
}