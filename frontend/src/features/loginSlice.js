import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userLogin } from "../api";
import Cookies from "js-cookie";
import { getProfile } from "../api";

const initialState = {
  userData: Cookies.get("userData") ? JSON.parse(Cookies.get("userData")) : [],
  friends: sessionStorage.getItem("friends")
    ? JSON.parse(sessionStorage.getItem("friends"))
    : [],
  friends_invitation: sessionStorage.getItem("socialApp")
    ? JSON.parse(sessionStorage.getItem("socialApp"))["friends_invitation"]
    : [],
  loading: false,
  error: false,
  isAuthenticated: Cookies.get("userData")
    ? JSON.parse(Cookies.get("userData"))["isAuthenticated"]
    : false,
};

export const login = createAsyncThunk("users/login", async (loginData) => {
  const response = await userLogin(loginData.login, loginData.password);
  return response;
});

export const loginSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      state.userData = "";
      document.cookie =
        "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      sessionStorage.removeItem("friends");
      sessionStorage.removeItem("friends_invitation");
    },
    acceptFriendInvite: (state, payload) => {
      state.friends = [...state.friends, payload.payload];
      sessionStorage.setItem("friends", JSON.stringify(state.friends));
    },
    deleteFriendReducer: (state, payload) =>{
      const friend_to_delete_id = payload.payload
      const updatedFriends = state.friends.filter(friend => friend.id !== friend_to_delete_id)
      sessionStorage.setItem("friends", JSON.stringify(updatedFriends));
      state.friends = updatedFriends;
    }
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, payload) => {
      const data = payload.payload;
      sessionStorage.setItem("friends", JSON.stringify(data.friends));
      sessionStorage.setItem(
        "friends_invitation",
        JSON.stringify(data.friends_invitation)
      );
      const keysToDelete = ["friends", "friends_invitation"];
      state.friends = data.friends;
      state.friends_invitation = data.friends_invitation;
      state.group_invitation = data.group_invitation;

      keysToDelete.forEach((key) => {
        delete data[key];
      });
      Cookies.set("userData", JSON.stringify(data));

      state.userData = data;
      state.loading = false;
      state.isAuthenticated = true;
    },
    [login.rejected]: (state, payload) => {
      state.loading = false;
      state.error = payload.error.message;
    },
  },
});

export const { logout, acceptFriendInvite, deleteFriendReducer } = loginSlice.actions;

export const loginReducer = loginSlice.reducer;
