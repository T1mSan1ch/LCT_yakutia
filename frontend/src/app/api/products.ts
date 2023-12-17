import {api} from "./api";

import {ProductInfo} from "../types";

const productsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<ProductInfo[], any>({
		  	query: () => `products`,
		}),
        updateProduct: builder.mutation({
            query: ({id, ...body}) => ({
                url: `/products/${id}`,
                method: 'POST',
                body
            })
        }),
    })
})

export const { useGetProductsQuery, useUpdateProductMutation } = productsApi