
import {EQUIPMENTS_URL} from "../util/urlconstants";
import {apiSlice} from "./apiSlice";

export const equipmentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder: any) => ({
        getAllEquipments: builder.query({
            query:({keyword} : any) => ({
                url: EQUIPMENTS_URL,
                params: {keyword},
                method: "GET",
            }),
            keepUnusedDataFor: 5,
            //@ts-ignore
            providesTags: ["Equipment"],
        }),
        getEquipmentById: builder.query({
            query:(id:string) => ({
                url: `${EQUIPMENTS_URL}/${id}`,
                method: "GET",
            })
        }),
        getMyEquipments: builder.query({
            query:(userId:string) => ({
                url: `${EQUIPMENTS_URL}/user/${userId}`,
                method: "GET",
            }),
            keepUnusedDataFor: 5,
        }),
        createEquipment: builder.mutation({
            query: (data: any) => ({
                url: EQUIPMENTS_URL,
                method: "POST",
                body: data,
            }),
            invalidateTags:["Equipment"]
        }),
        updateEquipment: builder.mutation({
            query: (data: any) => ({
                url: `${EQUIPMENTS_URL}/${data.id}`,
                method: "PUT",
                body: data,
            }),
            invalidateTags:["Equipment"]
        }),
        deleteEquipment: builder.mutation({
            query: (id:string) => ({
                url: `${EQUIPMENTS_URL}/${id}`,
                method: "DELETE",
            })
        })
    })
});

export const {
    useGetAllEquipmentsQuery,
    useGetEquipmentByIdQuery,
    useGetMyEquipmentsQuery,
    useCreateEquipmentMutation,
    useUpdateEquipmentMutation,
    useDeleteEquipmentMutation
} = equipmentApiSlice;