import {api} from "./api";

const textsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        updateTexts: builder.mutation({
            query: ({id, client_id, ...body}) => ({
                url: `/texts/${id}`,
                method: 'POST',
                body
            }),
            invalidatesTags: (result, error, { client_id }) => [{ type: 'Client', id: client_id }],
        }),
        regenText: builder.mutation({
            query: ({id, ...body}) => ({
                url: `/texts/${id}/regen`,
                method: 'POST',
                body
            }),
            invalidatesTags: (result, error, { client_id }) => [{ type: 'Client', id: client_id }],
        }),
    })
})

export const { useUpdateTextsMutation, useRegenTextMutation } = textsApi