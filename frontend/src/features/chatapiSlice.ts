
import {apiSlice} from "./apiSlice";
import {ChatSessionModel, ChatMessageModel} from "../model/ChatModel";

const CHAT_URL = "/api/chats";

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => {
        return ({
            sendAIMessage: builder.mutation({
                query: (session: any) => ({
                    url: `${CHAT_URL}/send`,
                    method: "POST",
                    body: session,
                }),
                invalidatesTags:["Chat"]
            }),
            searchMessage: builder.query({
                query: ({ query, filesystem }: { query: string; filesystem?: string }) => ({
                    url: `${CHAT_URL}/search`,
                    method: "GET",
                    params: { query, filesystem }
                }),
                providesTags: ["Chat"],
                keepUnusedDataFor: 5,
            }),
            sendSemanticAIMessage: builder.mutation({
                query: (session: any) => ({
                    url: `${CHAT_URL}/semantic_search`,
                    method: "POST",
                    body: session,
                }),
                invalidatesTags: ["Chat"],
            })
        });
    }
})

export const {
    useSendAIMessageMutation,
    useSendSemanticAIMessageMutation,
    useSearchMessageQuery,
} = chatApiSlice;