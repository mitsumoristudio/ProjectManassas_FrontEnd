

import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {BASE_URL, PRODUCTION_URL} from "../util/urlconstants";


// Development && Published URL
const baseQuery = fetchBaseQuery({
  //  baseUrl: BASE_URL
    baseUrl: PRODUCTION_URL

});

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: baseQuery,
    tagTypes: ["Project", "User", "ImageFile", "Equipment", "Chat"],
    endpoints: () =>({

    })
})