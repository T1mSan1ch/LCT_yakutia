import React, {ChangeEvent, FC} from "react";
import {Box, Slider, Stack, TextField, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";

interface InputWithSliderProps {
    title: string,
    min: number,
    max: number,
    onUpdate: (value: number) => void,
    value: number
}

export const InputWithSlider: FC<InputWithSliderProps> = ({ title, min, max, value, onUpdate }) => {

    const onChangeText = (event: ChangeEvent<HTMLInputElement>) => {
        if (min <= +event.target.value && +event.target.value <= max ) onUpdate(+event.target.value)
    }

    const onChangeSlider = (event: Event, value: number | number[]) => onUpdate(value as number)

    return (
        <Box>
            <Typography
                color={grey[500]}
                variant="subtitle1"
                fontWeight="bold"
                textTransform="uppercase"
            >
                {title}
            </Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={2} mb={1}>
                <Typography whiteSpace={"nowrap"}>Точное значение:</Typography>
                <TextField
                    type={"number"}
                    size={"small"}
                    fullWidth
                    value={value}
                    onChange={onChangeText}
                />
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
                <Typography>{min}</Typography>
                <Slider value={value} min={min} max={max} name={"temp"} step={0.1} onChange={onChangeSlider}/>
                <Typography>{max}</Typography>
            </Stack>
        </Box>
    )
}