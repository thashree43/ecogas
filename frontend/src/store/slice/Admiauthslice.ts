import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAdminData {
  _id: string;
  username: string;
  email: string;
  mobile: number | null;
  password: string;
  is_blocked: boolean;
  is_admin: boolean;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminAuthState {
  adminInfo: {
    admin: IAdminData;
    token: string;
    success: boolean;
  } | null;
}

const initialState: AdminAuthState = {
  adminInfo: JSON.parse(localStorage.getItem('AdminInfo') || 'null'),
};

const AdminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setAdminInfo(state, action: PayloadAction<AdminAuthState['adminInfo']>) {
      state.adminInfo = action.payload;
      localStorage.setItem('AdminInfo', JSON.stringify(action.payload));
    },
    
    
    clearAdminInfo(state) {
      state.adminInfo = null;
      localStorage.removeItem('AdminInfo');
    },
  },
});

export const { setAdminInfo, clearAdminInfo } = AdminAuthSlice.actions;
export default AdminAuthSlice.reducer;