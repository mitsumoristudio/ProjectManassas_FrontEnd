import {apiSlice} from "./apiSlice";

const EXCEL_URL = "/api/excel";

export interface InsertRowRequest {
    sheetId: string;
    values: Record<number, string>;
}

export interface DeleteCellRequest {
    sheetId: string;
    rowIndex: number;
    columnIndex: number;
}

export interface UpdateCellRequest {
    sheetId: string;
    rowIndex: number;
    columnIndex: number;
    value: string;
}

export interface BulkUpdateCellRequest {
    sheetId: string;
    updates: {
        rowIndex: number;
        columnIndex: number;
        value: string;
    }
}

export const excelApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => {
        return ({

            insertRow: builder.mutation<any, InsertRowRequest>({
                query: (body: any) => ({
                    url: `${EXCEL_URL}/row/insert`,
                    method: "POST",
                    body: body,
                }),
                invalidatesTags: ["TableDatasetCell"]
            }),

            updateCell: builder.mutation<any, UpdateCellRequest>({
                query: (body: any) => ({
                    url: `${EXCEL_URL}/cell/update`,
                    method: "POST",
                    body: body,
                }),
                invalidatesTags: ["TableDatasetCell"],

            }),

            deleteCell: builder.mutation<any, DeleteCellRequest>({
                query: ({sheetId, rowIndex, columnIndex}) => ({
                    url:`${EXCEL_URL}/cell/delete`,
                    method:"Delete",
                    body: {sheetId, rowIndex, columnIndex},
                }),
                invalidatesTags: ["TableDatasetCell"]
            }),

            bulkUpdateCell: builder.mutation<any, BulkUpdateCellRequest>({
                query: (body: any) => ({
                    url:`${EXCEL_URL}/cells/bulk_update`,
                    method:"POST",
                    body: body,
                }),
                invalidatesTags: ["TableDatasetCell"]
            }),
        })
    }
});

export const {
    useInsertRowMutation,
    useUpdateCellMutation,
    useDeleteCellMutation,
    useBulkUpdateCellMutation,
} = excelApiSlice;