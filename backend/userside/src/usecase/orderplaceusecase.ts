import { Types } from "mongoose";
import { IUserRepository } from "../infrastructure/repository";
import { IOrderData } from "../infrastructure/db";

interface CustomerDetails {
  name: string;
  consumerId: string;
  mobile: string;
  address: string;
}

interface SelectedGas {
  _id: string;
  companyname: string;
  weight: number;
  price: number;
}

export class orderplaceusecase {
  constructor(private UserRepositories: IUserRepository) {}

  async execute(
    userId: string,
    selectedProviderId: string,
    customerDetails: CustomerDetails,
    paymentMethod: string,
    selectedGas: SelectedGas
  ): Promise<IOrderData> {
    let statuschange ;
    if (paymentMethod === "UPI") {
        statuschange = "placed"
    }else{
        statuschange = "placed"
    }
    const orderData: Partial<IOrderData> = {
      name: customerDetails.name,
      address: customerDetails.address,
      mobile: parseInt(customerDetails.mobile),
      consumerid: parseInt(customerDetails.consumerId),
      company: selectedGas.companyname,
      price: selectedGas.price,
      paymentmethod: paymentMethod,
      expectedat: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 7 days from now
      status: statuschange
    };
    const selectedgasId = selectedGas._id
    const order = await this.UserRepositories.createOrder(selectedgasId,orderData);
    const orderId = order._id
    await this.UserRepositories.linkOrderToUser(userId, orderId);
    await this.UserRepositories.linkOrderToProvider(selectedProviderId, orderId);

    return order;
  }
}