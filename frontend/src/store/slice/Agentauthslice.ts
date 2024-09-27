import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AgentState {
  agentInfo: {
    agentId: string;
    agentname: string;
    email: string;
    // Add any other relevant fields
  } | null;
}

const initialState: AgentState = {
  agentInfo: null,
};

const agentAuthSlice = createSlice({
  name: 'agentAuth',
  initialState,
  reducers: {
    setagentInfo: (state, action: PayloadAction<AgentState['agentInfo']>) => {
      state.agentInfo = action.payload;
    },
    clearAgentInfo: (state) => {
      state.agentInfo = null;
    },
  },
});

export const { setagentInfo, clearAgentInfo } = agentAuthSlice.actions;
export default agentAuthSlice.reducer;