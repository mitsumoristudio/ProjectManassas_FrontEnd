
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
            }),

            sendExcelDocument: builder.mutation({
               query: ({formFile, tableName} : { formFile: File; tableName: string }) => {
                   const formData = new FormData();
                   formData.append("formFile", formFile);
                   formData.append("tableName", tableName);

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

            getExcelIngestedFiles: builder.query({
                //@ts-ignore
                query: ({keyword}) => ({
                    url: `${EXCEL_URL}/list_excelDocuments`,
                    method: "GET",
                    params: {keyword},
                }),
                keepUnusedDataFor: 5,
                //@ts-ignore
                providesTags: ["Chat"],
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
                providesTags: ["Chat"],
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
            })
        });
    }
})

export const {
    useSendAIMessageMutation,
    useSendChatMessageMutation,
    useDeletePdfIngestedMutation,
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
    useSendAIExcelMessageMutation,
    useGetColumnsBySheetIdQuery,
    useGetRowsBySheetIdQuery,
} = chatApiSlice;