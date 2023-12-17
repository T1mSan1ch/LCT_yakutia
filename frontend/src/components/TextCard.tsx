import React, {FC, ReactNode} from 'react';
import {Box, Card, Divider, Paper, Stack, styled, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";

interface TextCardProps {
	text: string,

	color: string,

	channel: string,
	product: string,

	buttons: ReactNode[]
}

export const TextCard: FC<TextCardProps> = ({ text, color, product, channel, buttons }) => {
	return (
		<Card>
			<Box display="flex">
				<Box display="flex" flex={1} justifyContent={"space-between"} alignItems={"center"} p={4}>
					<Box display="flex" flexDirection="column" gap={4}>
						<Box>
							<Typography color={grey[500]} variant="subtitle1" fontWeight="bold" textTransform="uppercase" lineHeight={0.5}>Канал</Typography>
							<Typography  variant="h6" fontWeight="bold">{channel}</Typography>
						</Box>

						<Box>
							<Typography color={grey[500]} variant="subtitle1" fontWeight="bold" textTransform="uppercase" lineHeight={0.5}>Продукт</Typography>
							<Typography variant="h6" fontWeight="bold">{product}</Typography>
						</Box>
					</Box>
					<Box>
						<Stack divider={<Divider />} spacing={1}>
							{buttons}
						</Stack>
					</Box>
				</Box>

				<Box minHeight={"100%"} bgcolor={color} minWidth={8}/>

				<Box display="flex" flex={3} flexDirection="column">
					<Typography px={6} py={4}>{text}</Typography>
				</Box>
			</Box>
		</Card>
	);
}
