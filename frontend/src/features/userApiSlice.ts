
import {apiSlice} from "../features/apiSlice";
import {USERS_URL} from "../util/urlconstants";

//export const USERURL_REGISTER = "http://localhost:5000/api/users";

// Define response & request types
export interface LoginResponse {
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// @ts-ignore
export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => {
        // @ts-ignore
        return {
            //@ts-ignore
            login: builder.mutation<LoginResponse, LoginRequest>({
                //@ts-ignore
                query: (credentials: any) => ({
                    url: `${USERS_URL}/login`,
                    method: "POST",
                    body: credentials,
                }),
            }),

            // login: builder.mutation({
            //     query: (data: any) => ({
            //         url: `${USERS_URL}/login`,
            //         method: "POST",
            //         body: data,
            //     })
            // }),


            logout: builder.mutation({
                query: () => ({
                    url: `${USERS_URL}/logout`,
                    method: "POST",
                })
            }),
            register: builder.mutation({
                query: (data: any) => ({
                    url: `${USERS_URL}/register`,
                    method: "POST",
                    body: data,
                })
            }),
            profile: builder.mutation({
                query: (data: any) => ({
                    url: `${USERS_URL}/profile`,
                    method: "POST",
                    body: data,
                })
            }),
            getAllUsers: builder.query({
                query: () => ({
                    url: USERS_URL,
                    method: "GET",
                }),
                keepUnusedDataFor: 5,
                providesTags: ["User"],
            }),
            deleteUser: builder.mutation({
                query: (userId: string) => ({
                    url: `${USERS_URL}/${userId}`,
                    method: "DELETE",
                })
            }),
            getUserDetails: builder.query({
                query: (userId: string) => ({
                    url: `${USERS_URL}/${userId}`,
                    method: "GET",
                })
            }),
            updateUser: builder.mutation({
                query: (data: any) => ({
                    url: `${USERS_URL}/${data.id}`,
                    method: "PUT",
                    body: data,
                }),
                invalidateTags: ["User"]
            }),
            verifyEmail: builder.mutation({
                query: (data: any) => ({
                    url: `${USERS_URL}/verifyEmail`,
                    method: "POST",
                    body: data,
                })
            }),
            forgotPassword: builder.mutation({
                query: (data: any) => ({
                    url: `${USERS_URL}/forgotPassword`,
                    method: "POST",
                    body: data,
                })
            }),
            resetPassword: builder.mutation({
                query: (data: any) => ({
                    url: `${USERS_URL}/resetPassword`,
                    method: "POST",
                    body: data,
                })
            })
        };
    }
})

export const {
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useProfileMutation,
    useDeleteUserMutation,
    useGetAllUsersQuery,
    useVerifyEmailMutation,
    useResetPasswordMutation,
    useForgotPasswordMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} = userApiSlice;