import React, {useEffect, useState} from 'react';
import {Box, Button, Card, Grid, IconButton, Modal, Paper, TextField, Typography} from "@mui/material";
import {TextCard} from "./TextCard";
import {useGetChannelsQuery, useGetProductsQuery} from "../app/api";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import {useRegenTextMutation, useUpdateTextsMutation} from "../app/api/texts";
import {InputWithSlider} from "./InputWithSlider";
import {grey} from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 980,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const RegenModal = ({ open, onClose, text, client_id }: any) => {

	const {data: products} = useGetProductsQuery(undefined)
	const {data: channels} = useGetChannelsQuery(undefined)

	const [updateText] = useUpdateTextsMutation()

	const [newTemp, setNewTemp] = useState(0.5)
	const [newTopP, setNewTopP] = useState(0.5)
	const [comment, setComment] = useState("")

	const [regen, {isLoading}] = useRegenTextMutation()

	useEffect(() => {
		if (text) {
			setNewTemp(text.temp)
			setNewTopP(text.top_p)
		}
	}, [text])


	const onRegenClick = () => {
	  	regen({
			id: text.id,
			client_id: text.client_id,
			channel_id: text.channel_id,
			product_id: text.product_id,
			text: text.text,
			comment,
			temp: newTemp,
			top_p: newTopP
		})
	}

	return (
		<Modal open={open} onClose={onClose}>
			<Paper sx={style}>
				<Box gap={3} display="flex" flexDirection="column">

					<Box display="flex" justifyContent="space-between">
						<Typography variant="h6" fontWeight="bold" textTransform="uppercase">регенерация текста</Typography>
						<IconButton onClick={onClose}>
							<CloseIcon/>
						</IconButton>
					</Box>

					{text && (
						<>
							<TextCard
								text={text.text}
								color={"#60A5FA"}
								channel={channels?.find(({ id }) => id === text.channel_id)?.name || ""}
								product={products?.find(({ id }) => id === text.product_id)?.name || ""}
								buttons={[
									(
										<IconButton  onClick={() => {
											updateText({id: text.id, client_id, is_good: true})
											onClose()
										}}>
											<ThumbUpIcon color="success"/>
										</IconButton>
									), (
										<IconButton onClick={() => {
											updateText({id: text.id, client_id, is_good: false})
											onClose()
										}} >
											<ThumbDownIcon color="error"/>
										</IconButton>
									)
								]}
							/>

							<Card>
								<Typography variant="h5" pl={5} pt={3}>Параметры регенерации</Typography>

								<Grid container>
									<Grid xs={6} p={5}>
										<Box display="flex" flexDirection="column" gap={4}>
											<InputWithSlider
											title={"Температура"}
											min={0} max={1}
											value={newTemp}
											onUpdate={setNewTemp}
										/>
										<InputWithSlider
											title={"TOP-P"}
											min={0} max={1}
											value={newTopP}
											onUpdate={setNewTopP}
										/>
										</Box>

									</Grid>
									<Grid xs={6} p={5} >
										<Box display="flex" flexDirection="column" gap={2}>
											<Typography
												color={grey[500]}
												variant="subtitle1"
												fontWeight="bold"
												textTransform="uppercase"
											>
												Комментарий
											</Typography>
										<TextField
											value={comment}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
												setComment(event.target.value);
											}}

											fullWidth

											multiline
											maxRows={4}

											placeholder="Комментарий к регенерации"
										/>
										<Button size="large" fullWidth disabled={isLoading} variant="contained" onClick={() => onRegenClick()}>{isLoading ? "Идет генерация" : "Регенерировать текст"}</Button>
										</Box>

									</Grid>
								</Grid>

							</Card>
						</>
					)}
				</Box>
			</Paper>
		</Modal>
	);
};

export default RegenModal;