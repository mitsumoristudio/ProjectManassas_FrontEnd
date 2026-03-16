import {apiSlice} from "./apiSlice";

const CONVERSATION_URL = "/api/conversation";

type UpdateProjectRequest = {
    id: string;
    chatProjectTitle: string;
};

export const conversationApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        listAllProjects: builder.query({
            query:() => ({
                url: `${CONVERSATION_URL}/projects`,
                method: "GET",
            }),
            providesTags: ["ConversationChatSession"],
            keepUnusedDataFor:5,
        }),
        listProjectConversationById: builder.query({
            query: (sessionId: string) => ({
                url: `${CONVERSATION_URL}/project_conversations/${sessionId}`,
                method: "GET",
                params: {sessionId}
            }),
            providesTags: ["ConversationMessage"],
            keepUnusedDataFor: 5,
        }),
        createProjectChat: builder.mutation({
            query: (data: any) => ({
                url: `${CONVERSATION_URL}/projectChat`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["ConversationChatSession"],
        }),
        getProjectId: builder.query({
            query: (id: string) => ({
                url: `${CONVERSATION_URL}/chat/${id}`,
                method: "GET",
            }),
            providesTags: ["ConversationChatSession"],
            keepUnusedDataFor: 5,
        }),
        updateProjectChat: builder.mutation<any, UpdateProjectRequest>({
            query: ({id, chatProjectTitle} : any) => ({
                url: `${CONVERSATION_URL}/${id}`,
                method: "PUT",
                body: {
                    chatProjectTitle: chatProjectTitle,
                    createdAt: new Date().toISOString()
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }),
            invalidatesTags: ["ConversationChatSession"]
        }),
        deleteProjectChat: builder.mutation({
            query: (id: string) => ({
                url: `${CONVERSATION_URL}/${id}`,
                method: "DELETE",
            })
        }),
        getConversationMessagesId: builder.query({
            query: (id: string) => ({
                url: `${CONVERSATION_URL}/messages/${id}`,
                method: "GET",
            }),
            providesTags: ["ConversationMessage"],
            keepUnusedDataFor: 5,
        }),
        getAllChatMessages: builder.query({
            query:({keyword}) => ({
                url: `${CONVERSATION_URL}/project_conversations`,
                method: "GET",
                params: {keyword},
            }),
            keepUnusedDataFor: 5,
            providesTags: ["ConversationProject"]
        }),
        chatProjectAdvisor: builder.mutation({
            query: (session: any) => ({
                url: `${CONVERSATION_URL}/projectAdvisor`,
                method: "POST",
                body: session,
            }),
            invalidatesTags: ["ConversationMessage", "ConversationChatSession"],
        })

    })
})

export const {
    useListAllProjectsQuery,
    useListProjectConversationByIdQuery,
    useCreateProjectChatMutation,
    useGetProjectIdQuery,
    useUpdateProjectChatMutation,
    useDeleteProjectChatMutation,
    useGetConversationMessagesIdQuery,
    useChatProjectAdvisorMutation,
    useGetAllChatMessagesQuery,
} = conversationApiSlice;