import {apiSlice} from "./apiSlice";

const CONVERSATION_URL = "/api/conversation";

export const conversationApiSlice = apiSlice.injectEndpoints({
    endpoints: (buider: any) => ({
        listAllProjects: buider.query({
            query:({keyword}) => ({
                url: `${CONVERSATION_URL}/projects`,
                params: {keyword},
                method: "GET",
            })
        }),
        createProjectChat: buider.mutation({
            query: (data: any) => ({
                url: `${CONVERSATION_URL}/projectChat`,
                method: "POST",
                body: data,
            }),
            keepUnusedDataFor: 5,
            invalidateTags:["ConversationProject"]
        }),
        getAllChatMessages: buider.query({
            query:({keyword}) => ({
                url: `${CONVERSATION_URL}/project_conversations`,
                method: "GET",
                params: {keyword},
            }),
            keepUnusedDataFor: 5,
        }),


    })
})

export const {
    useListAllProjectsQuery,
    useCreateProjectChatMutation,
    useGetAllChatMessagesQuery,
} = conversationApiSlice;