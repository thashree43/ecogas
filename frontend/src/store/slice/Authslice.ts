import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserData{
    _id?:string;
    username:string;
    email:string;
    mobile:number;
    password:string;
}


interface UserInfo {
  username: string;
  user: UserData;
  name: string;
  email: string;
  mobile: number;
  password: string;
}

interface AuthState {
  userInfo: UserInfo | null;
}

const initialState: AuthState = {
  userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfo>) {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      console.log("the data may her ",);
      
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
      console.log("the data has added to  the localstorage ");
      
    },
    clearUserInfo(state) {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});


export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;
