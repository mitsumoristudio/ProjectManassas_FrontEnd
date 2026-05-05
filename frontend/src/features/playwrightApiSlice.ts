import {apiSlice} from "./apiSlice";

const PLAYWRIGHT_API = "api/playWrightProject";

export const playWrightApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createPlayWrightProject: builder.mutation({
            query: (data:any) => ({
                url: `${PLAYWRIGHT_API}/createProject`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PlayWrightProject"]
        }),
        addPlayWrightQuery: builder.mutation({
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
            query: ({keyword}) => ({
                url: `${PLAYWRIGHT_API}/playbookProjects`,
                params: {keyword},
                method: "GET",
            }),
            providesTags: ["PlayWrightProject"],
            keepUnusedDataFor: 5,
        }),
        getPlayWrightQueryList: builder.query({
            query: () => ({
                url: `${PLAYWRIGHT_API}/listQuery`,
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
        updatePlayWrightProject: builder.mutation({
            query: (data: any) => ({
                url: `${PLAYWRIGHT_API}/project/${data.id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["PlayWrightProject"],
        })

    })
})
//TODO Need to add edit feature for PlayWright Project

export const {
    useCreatePlayWrightProjectMutation,
    useUpdatePlayWrightProjectMutation,
    useAddPlayWrightQueryMutation,
    useGetPlayWrightQueryListQuery,
    useGetPlayWrightProjectbyIdQuery,
    useGetPlayWrightProjectListQuery,
    useDeletePlayWrightProjectMutation,
    useDeletePlayWrightQueryMutation,
} = playWrightApiSlice;