import {configureStore} from '@reduxjs/toolkit'
import {apiSlice} from "../features/apiSlice"
import authSlice from "../features/authSlice";

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth: authSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;

