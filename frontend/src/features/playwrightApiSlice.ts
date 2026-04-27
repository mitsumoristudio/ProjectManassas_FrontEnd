import {apiSlice} from "./apiSlice";

const PLAYWRIGHT_API = "api/playWright";

export const playWrightApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPlaybookProject: builder.mutation({
            query: (data:any) => ({
                url: `${PLAYWRIGHT_API}/createProject`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PlayWrightProject"]
        }),
        addPlaybookQuery: builder.mutation({
            query: (data:any) => ({
                url: `${PLAYWRIGHT_API}/createQuery`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PlayWrightQuery"]
        }),
        getPlayWrightProjectbyId: builder.query({
            query : (id : string) => ({
                url: `${PLAYWRIGHT_API}/documentId/${id}`,
                method: "GET",
            }),
            providesTags: ["PlayWrightProject"],
            keepUnusedDataFor: 5,
        }),
        getPlayWrightQuerybyId: builder.query({
            query : (id : string) => ({
                url: `${PLAYWRIGHT_API}/queryId/${id}`,
                method: "GET",
            }),
            providesTags: ["PlayWrightQuery"],
            keepUnusedDataFor: 5,
        }),
        getPlayWrightProjectList: builder.query({
            query: () => ({
                url: `${PLAYWRIGHT_API}/playbookProjects`,
                method: "GET",
            }),
            providesTags: ["PlayWrightProject"],
            keepUnusedDataFor: 5,
        }),
        getPlayWrightQueryList: builder.query({
            query: () => ({
                url: `${PLAYWRIGHT_API}/listQuerys`,
                method: "GET",
            }),
            providesTags: ["PlayWrightQuery"],
            keepUnusedDataFor: 5,
        }),
        deletePlayWrightProject: builder.mutation({
            query: (id: string) => ({
                url: `${PLAYWRIGHT_API}/${id}`,
                method: "DELETE",
            })
        }),
        deletePlayWrightQuery: builder.mutation({
            query: (id: string) => ({
                url: `${PLAYWRIGHT_API}/query/${id}`,
                method: "DELETE",
            })
        }),

    })
})

export const {
    useCreatePlayWrightProjectMutation,
    useCreatePlayWrightQueryMutation,
    useGetPlayWrightQueryListQuery,
    useGetPlayWrightProjectListQuery,
    useDeletePlayWrightProjectMutation,
    useDeletePlayWrightQueryMutation,
} = playWrightApiSlice;