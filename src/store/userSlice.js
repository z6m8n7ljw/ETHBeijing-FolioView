import { createSlice } from "@reduxjs/toolkit";
import { USER_KEY } from "@/lib/constants";

const user = (() => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "");
  } catch (error) {
    return null;
  }
})();

const initialState = {
  user,
  isSignedIn: !!user,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInSuccess: (state, action) => {
      state.user = action.payload;
      state.isSignedIn = true;
    },
    signOutSuccess: (state) => {
      state.user = null;
      state.isSignedIn = false;
    },
  },
});

export const { signInSuccess, signOutSuccess } = userSlice.actions;

export default userSlice.reducer;
