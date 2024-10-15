import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
    selectedChat: any | null;
    chats: any[]; 
    notification: any[];
  }
const initialState :ChatState ={
    selectedChat : null,
    chats :[],
    notification:[],

}

const Chatslice = createSlice({
    name:'chat',
    initialState,
    reducers:{
        setSelectedChat: (state, action: PayloadAction<any>) => {
            state.selectedChat = action.payload;
          },
          setChats: (state, action: PayloadAction<any[]>) => {
            state.chats = action.payload;
          },
          setNotification: (state, action: PayloadAction<any[]>) => {
            state.notification = action.payload;
          },
          addNotification: (state, action: PayloadAction<any>) => {
            state.notification.push(action.payload);
          },
          clearNotifications: (state) => {
            state.notification = [];
          },
    }
})
export const {
    setSelectedChat,
    setChats,
    setNotification,
    addNotification,
    clearNotifications
} = Chatslice.actions