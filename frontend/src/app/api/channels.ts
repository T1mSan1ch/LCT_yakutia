import {api} from "./api";

import {ChannelInfo} from "../types";

const channelsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getChannels: builder.query<ChannelInfo[], any>({
            query: () => `channels`
        }),
        updateChannel: builder.mutation({
            query: ({id, ...body}) => ({
                url: `/channels/${id}`,
                method: 'POST',
                body
            })
        }),
    })
})

export const { useGetChannelsQuery, useUpdateChannelMutation } = channelsApi