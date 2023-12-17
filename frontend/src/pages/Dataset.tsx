import React, {MouseEvent, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";

import {useGetChannelsQuery, useGetDatasetClientQuery, useGetDatasetQuery, useGetProductsQuery} from "../app/api";

import {
	Accordion, AccordionDetails,
	AccordionSummary,
	Box, Card,
	Checkbox, Container,
	FormControlLabel, IconButton, InputAdornment,
	Stack,
	TablePagination, TextField,
	Typography
} from "@mui/material";

import Grid from '@mui/material/Unstable_Grid2';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplayIcon from '@mui/icons-material/Replay';
import SearchIcon from '@mui/icons-material/Search';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import {FilterBlock} from "../components/FilterBlock";
import {TextCard} from "../components/TextCard";
import {useUpdateTextsMutation} from "../app/api/texts";
import RegenModal from "../components/RegenModal";
import {grey} from "@mui/material/colors";

const categories = [
	{
		id: true,
		name: <Box display="flex" alignItems="center" gap={1}>ОК <ThumbUpIcon color="success"/></Box>
	},
	{
		id: false,
		name: <Box display="flex" alignItems="center" gap={1}>Не ОК <ThumbDownIcon color="error"/></Box>
	},
	{
		id: null,
		name: "Неразмеченные"
	}
]

const Dataset = () => {

	const {datasetId} = useParams();

	const {data: dataset} = useGetDatasetQuery(datasetId)

	const [page, setPage] = useState(0)

	const {data: products} = useGetProductsQuery(undefined)
	const {data: channels} = useGetChannelsQuery(undefined)



	const [categoriesFilter, setCategoriesFilter] = useState<any[]>([true, false, null])
	const [productsFilter, setProductsFilter] = useState<number[]>([0])
	const [channelsFilter, setChannelsFilter] = useState<number[]>([0])

	const {data: client } = useGetDatasetClientQuery(
		{
			datasetId,
			offset: page,

			categories: categoriesFilter,
			products: productsFilter,
			channels: channelsFilter

		}
	)

	const [updateText] = useUpdateTextsMutation()

	useEffect(() => {
		console.log(dataset)
	}, [dataset])

	const [edit, setEdit] = useState<null | number>(null);

	if (dataset && products && channels) return (
		<Box p={12}>
			<Typography variant={"h3"} fontWeight={"bolder"} ml={5} mb={5}>Результаты генераций</Typography>

			<Box display="flex" justifyContent="space-between" alignItems="center" ml={5} mb={7}>
				<Box display={"flex"} alignItems="center">
					<Typography variant="h4" fontWeight="bold">{dataset.name}</Typography>
					<NavigateNextIcon fontSize="large"/>
					<Typography variant="h4">Сгенерированные тексты</Typography>
				</Box>

				<Box display={"flex"} alignItems={"center"}>

					<Typography variant="h6">{page + 1} из {dataset.client_count}</Typography>

					<TablePaginationActions
					count={dataset.client_count}
					page={page}
					rowsPerPage={1}
					getItemAriaLabel={() => ""}
					onPageChange={(event, page) => setPage(page)}

					showFirstButton={false}
					showLastButton={false}
				/>
				</Box>
			</Box>

			<Grid container spacing={6}>
				<Grid xs={3}>
					<Card>
						<Box display="flex" flexDirection="column" p={2} gap={2}>
							<FilterBlock name="категории" options={categories}  value={categoriesFilter} onUpdate={setCategoriesFilter}/>
							<Box p={1.5}>
								<TextField
									placeholder={"Поиск"}
									fullWidth
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon />
											</InputAdornment>
										)
									}}
								/>
							</Box>
							<FilterBlock name="продукты" options={products}  value={productsFilter} onUpdate={setProductsFilter}/>
							<FilterBlock name="каналы связи" options={channels} value={channelsFilter} onUpdate={setChannelsFilter}/>
						</Box>

					</Card>
				</Grid>
				<Grid xs={9}>
					{client && (
						<>
							<Typography
								color={grey[500]}
								variant="subtitle1"
								fontWeight="bold"
								textTransform="uppercase"
								lineHeight={0.5}
							>
								ID
							</Typography>
							<Typography variant="h6" fontWeight="bold" mb={1}>{client.id}</Typography>

							<Box display="flex" flexDirection="column" gap={1}>
								{client.texts.map(({ id, text, is_good, channel_id, product_id }) => (
									<TextCard
										text={text}

										color={is_good ? "#5ACDC1" : is_good === false ? "#FF7270" : "#CCCCCC"}

										channel={channels.find(({ id }) => id === channel_id)!.name}
										product={products.find(({ id }) => id === product_id)!.name}

										buttons={[
											(
												<IconButton  onClick={() => updateText({id, client_id: client.id, is_good: true})}>
													<ThumbUpIcon color="success"/>
												</IconButton>
											),
											(
												<IconButton onClick={() => updateText({id, client_id: client.id, is_good: false})} >
													<ThumbDownIcon color="error"/>
												</IconButton>
											),
											(
												<IconButton onClick={() => setEdit(id)} >
													<ReplayIcon color="primary"/>
												</IconButton>
											)
										]}
									/>
								))}
							</Box>

							<RegenModal client_id={client.id} open={edit} onClose={() => setEdit(null)} text={client.texts.find(({ id }) => id === edit)}/>
						</>
					)}
				</Grid>
			</Grid>
		</Box>
	);

	return (<></>)
};

export default Dataset;