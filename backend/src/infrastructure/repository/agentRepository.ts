import { Schema, Types } from "mongoose";
import { IAgentRepository } from "../../domain";
import {
  agentModel,
  IagentData,
  IProductDocument,
  productModel,
  userModel,
  IUserData,
  IOrderData,
  orderModel
} from "../../infrastructure/database";
import { Agent, AgentProduct } from "../../domain";

export class AgentRepository implements IAgentRepository {
 
  async saveagent(agentdata: Agent): Promise<IagentData> {
    try {
      const newagent = new agentModel({
        agentname: agentdata.agentname,
        email: agentdata.email,
        mobile: agentdata.mobile,
        password: agentdata.password,
        pincode: agentdata.pincode,
        image: agentdata.image,
        is_Approved: agentdata.is_Approved,
      });
      const savedAgent = await newagent.save();
      return savedAgent.toObject();
    } catch (error) {
      console.error("Error saving agent:", error);
      throw error;
    }
  }
  async findemail(email: string): Promise<IagentData | null> {
    try {
      const agent = (await agentModel.findOne({ email })) as IagentData;
      return agent;
    } catch (error) {
      console.error("Error finding agent by email:", error);
      throw error;
    }
  }

  async findByPincode(pincode: string): Promise<IagentData[]> {
    try {
      const agentdata = (await agentModel.find({
        pincode: pincode,
      }).populate("products")) as IagentData[];
      return agentdata;
    } catch (error) {
      console.error("Error finding agents by pincode:", error);
      throw error;
    }
  }

  async addproduct(productData: AgentProduct, agentId: string): Promise<IProductDocument | null> {    
    try {      
      const agent = await agentModel.findById(agentId).populate<{ products: IProductDocument[] }>('products');              
      if (!agent) {        
        throw new Error("Agent not found");      
      }

      const normalizedCompanyName = productData.companyname.toLowerCase(); 
      
      // Check if the product already exists
      const existingProduct = agent.products.find((product) => product.companyname.toLowerCase() === normalizedCompanyName); 
      
      if (existingProduct) {        
        console.log("Product with the same company name already exists. Returning existing product.");        
        return existingProduct;      
      } 

      // Create and save the new product if it does not exist
      const newProduct = new productModel(productData); 
      const savedProduct = await newProduct.save(); 

      await this.linkProductToAgent(agentId, savedProduct._id); 
      return savedProduct;    

    } catch (error) {      
      console.error("Error adding product:", error);      
      throw error;    
    }  
  } 

  async linkProductToAgent(agentId: string, productId: Types.ObjectId): Promise<void> {    
    try {      
      await agentModel.findByIdAndUpdate(agentId, {        
        $push: { products: productId },      
      });    
    } catch (error) {      
      console.error("Error linking product to agent:", error);      
      throw error;    
    }  
  }

  async getallproduct(agentId: Types.ObjectId): Promise<IProductDocument[] | null> {
    try {
      const agent = await agentModel.findById(agentId).populate<{ products: IProductDocument[] }>('products');
      
      if (agent && agent.products && agent.products.length > 0) {
        return agent.products;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting all products for agent:", error);
      throw new Error("Error getting all products for agent");
    }
  }
  async findbyid(_id: Schema.Types.ObjectId): Promise<IProductDocument | null> {
    try {
      return await productModel.findById(_id).exec();
    } catch (error) {
      console.error("Error finding product by ID:", error);
      throw error;
    }
  }

  async updateProduct(
    _id: Types.ObjectId,
    updateData: Partial<IProductDocument>
  ): Promise<IProductDocument | null> {
    try {
      console.log("the repository reachhed to updateproduct");
      const data = await productModel
        .findByIdAndUpdate(_id, updateData, { new: true })
        .exec();
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  async deleteproduct(
    id: string | Types.ObjectId
  ): Promise<IProductDocument | null> {
    try {
      const product = await productModel.findById(id);
      if (!product) {
        throw new Error("Product not found");
      }  

      await agentModel.updateMany(
        { products: id },
        { $pull: { products: id } }
      );

      const deletedProduct = await productModel.findByIdAndDelete(id);
      console.log(
        "The product has been deleted from the database and agents' data"
      );

      return deletedProduct;
    } catch (error) {
      console.error("Error while deleting product:", error);
      throw new Error("Failed to delete product and unlink from agents");
    }
  }
  async getordersin(agentId: Types.ObjectId | string): Promise<IagentData | null> {
    try {
      const datas = await agentModel.findById(agentId).populate("orders");
      
      return datas;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  async updatestatus(id: Types.ObjectId | string): Promise<IOrderData | null> {
    try {
      const result = await orderModel.findByIdAndUpdate(
        id,
        { status: "delivered" },
        { new: true }
      );
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
