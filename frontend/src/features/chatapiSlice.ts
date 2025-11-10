
import {apiSlice} from "./apiSlice";
// import {ChatSessionModel, ChatMessageModel} from "../model/ChatModel";

const CHAT_URL = "/api/chats";
const PDF_URL = "/api/pdfs";

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
            }),
            sendSummaryAIMessage: builder.mutation({
                query: (session: any) => ({
                    url: `${CHAT_URL}/summary`,
                    method: "POST",
                    body: session,
                }),
                invalidatesTags: ["Chat"],
            }),
            sendSafetyAIMessage: builder.mutation({
                query: (session: any) => ({
                    url: `${CHAT_URL}/safety_search`,
                    method: "POST",
                    body: session,
                }),
                invalidatesTags: ["Chat"],
            }),
            sendDocumentEmbedding: builder.mutation({
                query: ({file, documentId} : { file: File; documentId: string }) => {
                    const formData = new FormData();
                    formData.append("formFile", file);
                    formData.append("documentId", documentId);

                    return {
                        url: `${PDF_URL}/ingest`,
                        method: "POST",
                        body: formData,
                    }
                }
            })
        });

    }
})

export const {
    useSendAIMessageMutation,
    useSendSemanticAIMessageMutation,
    useSearchMessageQuery,
    useSendDocumentEmbeddingMutation,
    useSendSummaryAIMessageMutation,
    useSendSafetyAIMessageMutation,
} = chatApiSlice;