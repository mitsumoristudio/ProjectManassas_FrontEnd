
import {apiSlice} from "./apiSlice";
import {ChatSessionModel, ChatMessageModel} from "../model/ChatModel";

const CHAT_URL = "/api/chats";

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => {
        return ({
            sendMessage: builder.mutation({
                query: (session: ChatSessionModel) => ({
                    url: `${CHAT_URL}/send`,
                    method: "POST",
                    body: session,
                }),
                invalidatesTags:["Chat"]
            }),
            searchMessage: builder.query({
                query: (query: string, filesystem: string) => ({
                    url: `${CHAT_URL}/search`,
                    method: "GET",
                    params: { query, filesystem }
                }),
                providesTags: ["Chat"],
                keepUnusedDataFor: 5,
            })
        });
    }
})

export const {
    useSendMessageMutation,
    useSearchMessageQuery,
} = chatApiSlice;