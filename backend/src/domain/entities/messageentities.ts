import { Types } from "mongoose";

export interface IMessageData{
    _id:Types.ObjectId
    reciever:Types.ObjectId[]
    sender:Types.ObjectId[]
    content:string;
    chat:Types.ObjectId[]
}

export class Message{
    _id:Types.ObjectId
    reciever:Types.ObjectId[]
    sender:Types.ObjectId[]
    content:string;
    chat:Types.ObjectId[]

    constructor(data:Partial<IMessageData>){
        this._id = data._id || new Types.ObjectId
        this.reciever = data.reciever || []
        this.sender = data.sender || []
        this.content = data.content!
        this.chat = data.chat || []
    }
}