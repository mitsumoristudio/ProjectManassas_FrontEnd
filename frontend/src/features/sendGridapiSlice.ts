
import {apiSlice} from "../features/apiSlice"

const MESSAGE_URL = "/api/message"

export const sendGridapiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => {
        return ({
            sendEmailAsync: builder.mutation({
                query: (payload: any) => ({
                    url: `${MESSAGE_URL}/sendEmail`,
                    method: "POST",
                    body: payload,
                }),
                invalidatesTags: ["Message"]
            }),
            sendContactAsync: builder.mutation({
                query: (payload: any) => ({
                    url: `${MESSAGE_URL}/sendContactMessage`,
                    method: "POST",
                    body: payload,
                }),
                invalidatesTags: ["Message"]
            }),
            sendVerificationEmailAsync: builder.mutation({
                query: (payload: any) => ({
                    url: `${MESSAGE_URL}/sendVerificationEmail`,
                    method: "POST",
                    body: payload,
                }),
                invalidatesTags: ["Message"]
            })
        })
    }
})

export const {
    useSendEmailAsyncMutation,
    useSendContactAsyncMutation,
    useSendVerificationEmailAsyncMutation,
} = sendGridapiSlice;
