
import {apiSlice} from "./apiSlice";
// import {PROJECT_URL} from "@/src/util/urlconstants";


const CHAT_URL = "/api/chats";
const PDF_URL = "/api/pdfs";
const EXCEL_URL = "/api/excel";

export interface SendAIExcelMessagePayload {
    sheetId: string;
    question: string;
    chatSession: {
        sessionId: string;
        title: string;
        messages: {
            role: "User";
            messageContent: string;
        }[];
    };
}

export interface TableCell {
    columnIndex: number;
    columnName: string;
    value: string;
}

export interface TableRow {
    rowIndex: number;
    cells: TableCell[];
}

export interface TableColumn {
    columnIndex: number;
    columnName: string;
    sheetId: string;
}

export interface ChatMessageRequest {
    sessionId: string;
    role: "User" | "Assistant";
    messageContent: string;
}

export interface ChatSessionRequest {
    sessionId: string;
    title: string;
    messages: ChatMessageRequest[];
}

export interface SpreadSheetChatRequest {
    tableDataSetId: string,
    projectQueryTitle: string,
    playWrightProjectId: string,
    playWrightQueryId: string,
    azureBlobId: string,
    question: string,
    singleTabular: string,
    session: ChatSessionRequest
}

export interface ChatMessageResponse {
    sessionId: string;
    role: string;
    messageContent: string;
    createdAt: string;
    userId: string;
    playWrightProjectId: string;
    playWrightQueryId: string;
    tableDataSetId: string;
}


export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => {
        // @ts-ignore
        // @ts-ignore
        return ({
            sendAIMessage: builder.mutation({
                query: (session: any) => ({
                    url: `${CHAT_URL}/send`,
                    method: "POST",
                    body: session,
                }),
                invalidatesTags:["Chat"]
            }),
            sendChatMessage: builder.mutation({
               query: (session: any) => ({
                   url: `${CHAT_URL}/sendChatMessage`,
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
                invalidatesTags: ["ConversationMessage", "Chat"],
            }),

            sendSafetyAIMessage: builder.mutation({
                query: (session: any) => ({
                    url: `${CHAT_URL}/safety_search`,
                    method: "POST",
                    body: session,
                }),
                invalidatesTags: ["Chat"],
            }),
            sendProjectAdvisor: builder.mutation({
                query: (session: any) => ({
                    url: `${CHAT_URL}/project_advisor`,
                    method: "POST",
                    body: session,
                }),
                invalidatesTags: ["Chat"],
            }),
            sendProposalDraft: builder.mutation({
                query: (session: any) => ({
                    url: `${CHAT_URL}/proposal_draft`,
                    method: "POST",
                    body: session,
                }),
                invalidatesTags: ["Chat"],
            }),
            sendDocumentEmbedding: builder.mutation({
                query: ({file, playWrightProjectId} : { file: File; playWrightProjectId: string}) => {
                    const formData = new FormData();
                    formData.append("formFile", file);
                    formData.append("playWrightProjectId", playWrightProjectId);

                    return {
                        url: `${PDF_URL}/ingest`,
                        method: "POST",
                        body: formData,
                    }
                }
            }),

            sendExcelDocument: builder.mutation({
               query: ({formFile, tableName, playWrightProjectId} : { formFile: File; tableName: string, playWrightProjectId: string }) => {
                   const formData = new FormData();
                   formData.append("formFile", formFile);
                   formData.append("tableName", tableName);
                   formData.append("playWrightProjectId", playWrightProjectId);

                   return {
                       url: `${EXCEL_URL}/ingest`,
                       method: "POST",
                       body: formData,
                   }
               }
            }),

            sendAIExcelMessage: builder.mutation({
                query: (payload: SendAIExcelMessagePayload) => ({
                    url: `${EXCEL_URL}/tablechat`,
                    method: "POST",
                    body: payload,
                }),
                invalidatesTags: ["Chat"],
            }),

            processSpreadSheetChatAsync: builder.mutation<
                SpreadSheetChatRequest, ChatMessageResponse>({
                query: (payload) =>({
                    url: `${EXCEL_URL}/spreadSheetChat`,
                    method: "POST",
                    body: payload,
                }),
                invalidatesTags: ["TableDataSet", "TableDatasetCell"],
            }),

            getExcelIngestedFiles: builder.query({
                //@ts-ignore
                query: ({keyword}: any) => ({
                    url: `${EXCEL_URL}/list_excelDocuments`,
                    method: "GET",
                    params: {keyword}
                }),
                keepUnusedDataFor: 5,
                //@ts-ignore
                providesTags: ["TableDataSet"],
            }),

            fetchExcelFiles: builder.query({
                //@ts-ignore
                query: (id: string) => ({
                    url: `${EXCEL_URL}/fetchExcels/${id}`,
                    method: "GET",
                }),
                keepUnusedDataFor: 5,
                //@ts-ignore
                providesTags: ["TableDataSet"],
            }),

            getColumnsBySheetId: builder.query<TableColumn[], string>({
                query: (sheetId: string) => ({
                    url: `${EXCEL_URL}/column/${sheetId}`,
                    method: "GET",
                }),
                transformResponse: (res: any) => Array.isArray(res) ? res : [],
                providesTags: ["TableDatasetColumn"],
            }),

            getRowsBySheetId: builder.query<TableRow[], string>({
                query: (sheetId: string) => ({
                    url: `${EXCEL_URL}/rows/${sheetId}`,
                    method: "GET",
                }),
                transformResponse: (res: any) => Array.isArray(res) ? res : [],
                providesTags: ["TableDatasetCell"],
            }),

            updateExcelCell: builder.mutation<void, {
                sheetId: string,
                rowIndex: number,
                columnIndex: number,
                value: string;
            }>({
                query: ({sheetId, rowIndex, columnIndex, value}) => ({
                    url: `${EXCEL_URL}/edit/${sheetId}`,
                    method: "PATCH",
                    body: {sheetId, rowIndex, value, columnIndex},
                }),
                invalidatesTags: ["TableDatasetCell"],
            }),

            deleteExcelIngestedFiles: builder.mutation({
                query: (documentId: string) => ({
                    url: `${EXCEL_URL}/${documentId}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["Chat"],
            }),

            getPdfIngested: builder.query({
                //@ts-ignore
                query: ({keyword}) => ({
                    url: `${PDF_URL}/list_pdf`,
                    method: "GET",
                    params: {keyword},
                }),
                keepUnusedDataFor: 5,
                //@ts-ignore
                providesTags: ["Chat", "AzureBlobs"],
            }),

            getPdfFromPlayWrightProjectId: builder.query({
                query: (playWrightProjectId: any) => ({
                    url: `${PDF_URL}/list_pdf/${playWrightProjectId}`,
                    method: "GET",
                }),
                keepUnusedDataFor: 5,
                providesTags: ["Chat", "AzureBlobs"],
            }),

            deletePdfIngested: builder.mutation({
                query: (documentId: string) => ({
                    url: `${PDF_URL}/${documentId}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["Chat"],
            }),

            deleteEntirePdf: builder.mutation({
                query: (documentId: string) => ({
                    url: `${PDF_URL}/preview/${documentId}`,
                    method: "DELETE",
                }),
                invalidatesTags: ["Chat"],
            }),

            getAzureBlobUrl: builder.query({
                query: (azureBlobId: string) => ({
                    url: `${PDF_URL}/blob/${azureBlobId}`,
                    method: "GET",
                }),
                providesTags: ["AzureBlobs"],
                keepUnusedDataFor: 5,
            }),

        });
    }
})

export const {
    useSendAIMessageMutation,
    useSendChatMessageMutation,
    useDeletePdfIngestedMutation,
    useProcessSpreadSheetChatAsyncMutation,
    useSendSemanticAIMessageMutation,
    useDeleteEntirePdfMutation,
    useSearchMessageQuery,
    useSendProjectAdvisorMutation,
    useSendProposalDraftMutation,
    useSendDocumentEmbeddingMutation,
    useSendSummaryAIMessageMutation,
    useSendSafetyAIMessageMutation,
    useGetPdfIngestedQuery,
    useUpdateExcelCellMutation,
    useDeleteExcelIngestedFilesMutation,
    useSendExcelDocumentMutation,
    useGetExcelIngestedFilesQuery,
    useFetchExcelFilesQuery,
    useSendAIExcelMessageMutation,
    useGetColumnsBySheetIdQuery,
    useGetRowsBySheetIdQuery,
    useGetAzureBlobUrlQuery,
    useGetPdfFromPlayWrightProjectIdQuery,
} = chatApiSlice;