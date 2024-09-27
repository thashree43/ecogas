import { agentModel, IagentData, IBookData, IOrderData, IUserData, orderModel, productModel } from "../../../infrastructure/db";
import { IUserRepository } from "../interface/userinterface";
import { userModel, bookModel } from "../../../infrastructure/db"; // Import userModel if not already
import { BookData, OrderData, User } from "../../../entities";
import { Types } from "mongoose";

export class UserRepository implements IUserRepository {
  async getall(): Promise<IUserData[] | null> {
    try {
      return await userModel.find().lean<IUserData[]>();
      console.log("hello here reached");
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  async getbyId(id: string): Promise<IUserData | null> {
    try {
      return await userModel.findOne({ _id: id });
      console.log("hello here reached");
    } catch (error) {
      throw new Error("error in db");
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
  async findbyEmail(email: string): Promise<IUserData | null> {
    return (await userModel.findOne({ email })) as IUserData;
  }

  async saveuser(userData: User): Promise<IUserData> {
    try {
      const createUser = new userModel(userData);
      return (await createUser.save()) as IUserData;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findByGoogleId(googleId: string): Promise<IUserData | null> {
    return (await userModel.findOne({ _id: googleId })) as IUserData;
  }
  async updatePassword(email: string, password: string): Promise<boolean> {
    try {
      const user = await userModel.findOne({ email });
      if (!user) return false;
      user.password = password;
      await user.save();
      return true;
    } catch (error) {
      throw new Error("the password has not changed");
    }
  }
  async savebook(book: BookData): Promise<IBookData> {
    try {
      const bookdata = new bookModel(book);
      return await bookdata.save();
    } catch (error) {
      throw new Error("the data is invalid to add the book");
    }
  }
  async linkbooktouser(userId: string, bookId: Types.ObjectId): Promise<void> {
    try {
      const addeddate = await userModel.findByIdAndUpdate(
        { _id: userId },
        { $push: { book: bookId } }
      );
    } catch (error) {
      console.error("the error seems here");
      throw new Error("invalid server error");
    }
  }
 
  async getbookbyid(userId: Types.ObjectId): Promise<IUserData | null> {
    try {
      const user = await userModel.findById(userId).populate('book');
      return user;
    } catch (error) {
      console.error("Error in getbookbyid:", error);
      return null;
    }
  }
  async deletebookbyid(bookId: Types.ObjectId | string): Promise<IBookData | null> {
      try {
        const Book = await bookModel.findById(bookId);
        console.log("bookdata found in the userrepository",Book);
        if (!Book) {
          throw new Error("the book has not found")
        }
        await userModel.updateMany({book:bookId},{$pull:{book:bookId}})
        const deletebook = await bookModel.findByIdAndDelete(bookId)
        console.log("the book has been deleted");
        
        return deletebook
      } catch (error) {
        throw new Error("the book has not yet deleted ")
      }
  }
  async createOrder(selectedgasId:Types.ObjectId | string,order: Partial<OrderData>): Promise<IOrderData> {
    try {
      const gasdata = await productModel.findById(selectedgasId)
      if (gasdata && gasdata.quantity > 0) {
       const newOrder = new orderModel(order)
      const orderdata = await newOrder.save()
      
      await productModel.findByIdAndUpdate(selectedgasId,{ $inc: { quantity: -1 } })
      return orderdata
      }else {
        throw new Error("Insufficient product quantity to create order");
      }
      
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create order");
    }
  }

  async linkOrderToUser(userId: string | Types.ObjectId, orderId: string | Types.ObjectId): Promise<IUserData | null> {
    try {
      const updatedUser = await userModel.findByIdAndUpdate(userId, { $push: { orders: orderId } }, { new: true });
      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to link order to user");
    }
  }

  async linkOrderToProvider(selectedProviderId: string | Types.ObjectId, orderId: string | Types.ObjectId): Promise<IagentData | null> {
    try {
      const updatedAgent = await agentModel.findByIdAndUpdate(selectedProviderId, { $push: { orders: orderId } }, { new: true });
      return updatedAgent;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to link order to provider");
    }
  }
  async listorder(id: Types.ObjectId | string): Promise<IUserData> {
    try {
      const data = await userModel.findById(id).populate('orders');
      if (!data) {
        throw new Error("User not found");
      }
      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Error occurred while fetching orders");
    }
  }
}

