import {api} from "./api";

import {ClientWithTexts, Dataset} from "../types";

const datasetsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getDatasets: builder.query<Dataset[], any>({
		  	query: () => 'datasets',
		}),
		getDataset: builder.query<Dataset, any>({
		  	query: (id) => `datasets/${id}`,
		}),
		getDatasetClient: builder.query<ClientWithTexts, any>({
		  	query: ({datasetId, ...params}) => ({
				url: `datasets/${datasetId}/clients`,
				params
			}),
			providesTags: (result, error, {datasetId}) => [{
				type: 'Client',
				id: result!.id
			}]
		}),
		uploadDataset: builder.mutation<number, FormData>({
			query: form => ({
				url: 'datasets/upload',
				method: 'POST',
				body: form
			})
		}),
		updateDataset: builder.mutation({
            query: ({id, ...body}) => ({
                url: `/datasets/${id}`,
                method: 'POST',
                body
            })
        }),
    })
})

export const {
	useGetDatasetsQuery,
	useGetDatasetQuery,
	useGetDatasetClientQuery,
	useUpdateDatasetMutation,
	useUploadDatasetMutation
} = datasetsApi