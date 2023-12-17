import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ChannelInfo, Dataset, ProductInfo} from "../types";

export const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Client'],
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:9000' }),
  endpoints: (builder) => ({}),
})