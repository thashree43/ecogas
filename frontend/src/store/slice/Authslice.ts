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
  token: string | null; // Add token here

}
interface UserState {
  token: string | null;
  userInfo: any; // Define your user info type here
}


const initialState: AuthState = {
  userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
  token: null

};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    
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
    clearUserToken(state, action: PayloadAction<string | null>){
      state.token = null;

    }
  },
});


export const { setUserInfo, clearUserInfo ,setUserToken,clearUserToken} = authSlice.actions;
export default authSlice.reducer;
