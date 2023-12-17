import {FC, ReactElement, useEffect, useState} from 'react';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Checkbox,
	FormControlLabel,
	Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {grey} from "@mui/material/colors";

interface FilterBlockProps {
	name: string

	options: {
		id: any,
		name: string | ReactElement
	}[],

	value: any[]
	onUpdate: (value: any[]) => void
}

export const FilterBlock: FC<FilterBlockProps> = ({ name, options, value, onUpdate }) => {

	useEffect(() => {
		onUpdate(options.map(({ id }) => id))
	}, [])

	const handleChangeRoot = (event: React.ChangeEvent<HTMLInputElement>) => {
    	onUpdate(event.target.checked ? options.map(({ id }) => id) : []);
  	}

	const handleChangeBranch = (id: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
		onUpdate(event.target.checked ? value.concat(id) : value.filter(e => e !== id))
	}

	return (
		<Accordion defaultExpanded disableGutters elevation={0}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
			  <Typography color={grey[500]} variant="subtitle1" fontWeight="bold" textTransform="uppercase" lineHeight={0.5}>{name}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<FormControlLabel
					label="Все"
					control={
						<Checkbox
							checked={value.length === options.length}
							indeterminate={value.length > 0 && value.length !== options.length}
							onChange={handleChangeRoot}
						/>
					}
				/>
				<Box display="flex" flexDirection="column" ml={3}>
					{options.map(({ id, name}) => (
						<FormControlLabel
							label={name}
							control={
								<Checkbox
									checked={value.includes(id)}
									onChange={handleChangeBranch(id)}
								/>
							}
						/>
					))}
				</Box>
			</AccordionDetails>
		</Accordion>
	)
}