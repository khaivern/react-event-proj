import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userId: null,
    token: null,
    tokenExpiration: null,
  },
  reducers: {
    login(state, action) {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.tokenExpiration = action.payload.expiration;
    },
    logout(state) {
      state.userId = null;
      state.token = null;
      state.tokenExpiration = null;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
