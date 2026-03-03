

import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL, PRODUCTION_URL} from "../util/urlconstants";


// Development && Published URL
const baseQuery = fetchBaseQuery({
   // baseUrl: BASE_URL,
      baseUrl: PRODUCTION_URL,
    prepareHeaders: (headers, {getState}) => {
        const token = (getState() as any).auth?.userInfo?.token;

        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }

});

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    tagTypes: ["Project", "User", "ImageFile", "Equipment", "Chat", "Message"],
    endpoints: () =>({
    })
})