

import {PROJECT_URL, UPLOAD_URL} from "../util/urlconstants";

import {apiSlice} from "../features/apiSlice"

export const projectApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        getAllProjects: builder.query({
            //@ts-ignore
            query: ({keyword}) => ({
                url: PROJECT_URL,
                params: {keyword},
                method: "GET",
            }),
            keepUnusedDataFor: 5,
            //@ts-ignore
            providesTags: ["Project"],
        }),
        getProject: builder.query({
            query: (id: string) => ({
                url: `${PROJECT_URL}/${id}`,
                method: "GET",
            })
        }),
        getMyProject: builder.query({
            query: (userId: string) => ({
                url: `${PROJECT_URL}/${userId}/myProject`,
                method: "GET",
            }),
            keepUnusedDataFor: 5,
        }),
        createProject: builder.mutation({
            query: (data: any) => ({
                url: PROJECT_URL,
                method: "POST",
                body: data,
            }),
            invalidateTags:["Project"]
        }),
        updateProject: builder.mutation({
            query: (data: any) => ({
                url: `${PROJECT_URL}/${data.id}`,
                method: "PUT",
                body: data
            }),
            invalidateTags:["Project"]
        }),
        deleteProject: builder.mutation({
            query: (id: string) => ({
                url: `${PROJECT_URL}/${id}`,
                method: "DELETE",
            })
        }),
        uploadProjectImage: builder.mutation({
            query: (data: any) => ({
                url: `${UPLOAD_URL}`,
                method: "POST",
                body: data
            })
        })
    })
});

export const {
    useGetAllProjectsQuery,
    useGetProjectQuery,
    useGetMyProjectQuery,
    useCreateProjectMutation,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useUploadProjectImageMutation,
} = projectApiSlice;

