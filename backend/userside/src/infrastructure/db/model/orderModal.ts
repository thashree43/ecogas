import { Schema, model, Document, Types } from "mongoose";

export interface IOrderData extends Document{
    _id:Types.ObjectId;
    name:string;
    address:string;
    mobile:number;
    consumerid:number;
    company:string;
    price:number;
    paymentmethod:string;
    expectedat:Date;
    status:string;
}

const orderSchema = new Schema ({
    name:{type:String,required:true},
    address:{type:String,required:true},
    mobile:{type:Number,required:true},
    consumerid:{type:Number,required:true},
    company:{type:String,required:true},
    price:{type:Number,required:true},
    paymentmethod:{type:String,required:true},
    expectedat:{type:Date,required:true},
    status:{type:String,required:true}
},
{timestamps:true}
)

export const orderModel = model<IOrderData>("Orders", orderSchema);
