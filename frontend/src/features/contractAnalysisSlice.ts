import {apiSlice} from "./apiSlice";

const CONTRACT_ANALYSIS_URL = "/api/contractAnalysis";

export const contractAnalysisSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        contractAnalysis: builder.mutation({
            query:({projectQueryTitle, playWrightProjectId, documentId, azureBlobId, singleTabular}: {projectQueryTitle: string, playWrightProjectId: any, azureBlobId: any, documentId: string, singleTabular: string}) => ({
                url: `${CONTRACT_ANALYSIS_URL}/analyzeContract`,
                method: "POST",
                body: {projectQueryTitle, playWrightProjectId, azureBlobId, documentId, singleTabular},
            }),
            invalidatesTags: ["PlayWrightQuery", "ClauseAnalysis", "ContractAnalyze"]
        }),
        adviseContract: builder.mutation({
            query:({projectQueryTitle, playWrightProjectId, azureBlobId, documentId, singleTabular}: {projectQueryTitle: string, playWrightProjectId: any, azureBlobId: any, documentId: string, singleTabular: string}) => ({
                url: `${CONTRACT_ANALYSIS_URL}/adviseContract`,
                method: "POST",
                body: {projectQueryTitle, playWrightProjectId, azureBlobId, documentId, singleTabular},
            }),
            invalidatesTags: ["PlayWrightQuery", "ClauseAnalysis", "ContractAnalyze"]
        }),
        reviewSpecification: builder.mutation({
            query:({projectQueryTitle, playWrightProjectId, azureBlobId, documentId, singleTabular}: {projectQueryTitle: string, playWrightProjectId: any, azureBlobId: any, documentId: string, singleTabular: string}) => ({
                url: `${CONTRACT_ANALYSIS_URL}/reviewSpecification`,
                method: "POST",
                body: {projectQueryTitle, playWrightProjectId, azureBlobId, documentId, singleTabular},
            }),
            invalidatesTags: ["PlayWrightQuery", "ClauseAnalysis", "ContractAnalyze"]
        }),

        continueSummarization: builder.mutation({
            query:({   projectQueryTitle,
                       playWrightQueryId,
                       playWrightProjectId,
                       azureBlobId,
                       documentId,
                       singleTabular,
                       session,
                   }: {
                projectQueryTitle: string,
                playWrightQueryId: string,
                playWrightProjectId: any,
                azureBlobId: any,
                documentId: string,
                singleTabular: string,
                session: any}) => ({
                url: `${CONTRACT_ANALYSIS_URL}/continueSummarization`,
                method: "POST",
                body: {
                    projectQueryTitle,
                    playWrightProjectId,
                    playWrightQueryId,
                    azureBlobId,
                    documentId,
                    singleTabular,
                    session
                },
            }),
            invalidatesTags: ["PlayWrightQuery", "ContractAnalyze",]
        }),

        summaryContract: builder.mutation({
            query:({   projectQueryTitle,
                       playWrightProjectId,
                       azureBlobId,
                       documentId,
                       singleTabular,
                       session,
                       }: {
                projectQueryTitle: string,
                playWrightProjectId: any,
                azureBlobId: any,
                documentId: string,
                singleTabular: string,
                session: any}) => ({
                url: `${CONTRACT_ANALYSIS_URL}/summaryContract`,
                method: "POST",
                body: {projectQueryTitle,
                       playWrightProjectId,
                       azureBlobId,
                       documentId,
                       singleTabular,
                       session},
            }),
            invalidatesTags: ["PlayWrightQuery", "ContractAnalyze",]
        }),

    })
})

export const {
    useContractAnalysisMutation,
    useAdviseContractMutation,
    useReviewSpecificationMutation,
    useSummaryContractMutation,
    useContinueSummarizationMutation,
} = contractAnalysisSlice;