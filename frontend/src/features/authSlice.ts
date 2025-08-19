

import {createSlice} from '@reduxjs/toolkit';
// set the users credentials to local storage and remove them

const initialState = {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo") as string) : null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state: any, action: any) => {
            state.userInfo = action.payload;
            localStorage.setItem("userInfo", JSON.stringify(action.payload));
        },

        //@ts-ignore
        logout: (state : any, action: any) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");

            localStorage.clear();
        }
    }
});

export const { setCredentials, logout} = authSlice.actions;

export default authSlice.reducer