import {
    Badge,
    Box,
    Button, ButtonBase, Card, Chip,
    Divider,
    Input,
    InputLabel, Paper,
    Slide,
    Slider,
    Stack,
    TextField,
    Typography
} from '@mui/material';

import Grid from '@mui/material/Unstable_Grid2';

import TableChartIcon from '@mui/icons-material/TableChart';

import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {styled} from "@mui/material";
import React, {ChangeEvent, FC, useEffect} from "react";
import {useFormik} from "formik";
import {
    useGetChannelsQuery,
    useGetDatasetsQuery,
    useGetProductsQuery,
    useUpdateChannelMutation, useUpdateDatasetMutation, useUpdateProductMutation,
    useUploadDatasetMutation
} from "../app/api";
import {useNavigate} from "react-router-dom";
import {InputWithSlider} from "../components/InputWithSlider";
import {grey} from "@mui/material/colors";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});





const datasetsCols: GridColDef[] = [
    {
        width: 250,
        field: 'name',
        headerName: 'НАЗВАНИЕ',
        sortable: false
    },
    {
        width: 180,
        field: 'uploaded_at',
        headerName: 'ЗАГРУЖЕНО',
        valueFormatter: params =>
            new Date(params.value)
                .toLocaleString("ru-RU", {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
        sortable: false
    },
    {
        width: 120,
        field: 'text_count',
        headerName: 'ЗАПИСЕЙ',
        sortable: false
    },
    {
        width: 200,
        field: 'client_count',
        headerName: 'ТЕКСТОВ',
        renderCell: params => (
            <Stack direction={"row"} spacing={1}>
                <Typography>
                    {params.row.text_count}
                </Typography>
                <Box>
                    <Divider orientation={"vertical"} />
                </Box>


                <Chip label={params.row.good_count} size={"small"} color={"success"} />
                <Chip label={params.row.bad_count} size={"small"} color={"error"} />
                <Chip label={params.row.left_count} size={"small"} />
            </Stack>
        ),
        sortable: false
    },
    {
        flex: 1,
        field: 'comment',
        editable: true,
        headerName: 'КОММЕНТАРИЙ',
        sortable: false
    },
]

const channelCols: GridColDef[] = [
    {
        flex: 1,
        field: 'name',
        headerName: 'НАЗВАНИЕ',
        sortable: false
    },
    {
        flex: 2,
        field: 'description',
        editable: true,
        headerName: 'ОПИСАНИЕ',
        sortable: false
    }
];

const productCols: GridColDef[] = [
    {
        flex: 1,
        field: 'name',
        headerName: 'НАЗВАНИЕ',
        sortable: false,

    },
    {
        flex: 2,
        field: 'description',
        editable: true,
        headerName: 'ОПИСАНИЕ',
        sortable: false
    }
]

interface UploadValues {
    file: undefined | File
    temp: number
    top_p: number,
    channels_ids: number[],
    products_ids: number[]
}

const initialValues: UploadValues = {
    file: undefined,
    temp: 0.5,
    top_p: 0.5,
    channels_ids: [],
    products_ids: []
}

const Generator = () => {

    const navigate = useNavigate()

    const { data: datasets } = useGetDatasetsQuery(undefined);

    const { data: channels } = useGetChannelsQuery(undefined);

    const { data: products } = useGetProductsQuery(undefined)

    const [uploadDataset, {isLoading, data}] = useUploadDatasetMutation()

    const [updateDataset] = useUpdateDatasetMutation()

    const [updateChannel] = useUpdateChannelMutation()

    const [updateProduct] = useUpdateProductMutation()

    useEffect(() => {
        if (data) {
            navigate(`datasets/${data}`)
        }
    }, [data])

    const formik = useFormik({
     initialValues,
     onSubmit: values => {
        const formData = new FormData();
        for (let [key, value]  of Object.entries(values)) {
            if (Array.isArray(value)) {
                for (const v of value) {
                    formData.append(key, v)
                }
            } else {
                formData.append(key, value);
            }
        }
        uploadDataset(formData)

     },
   });

    const is_gen_allowed = formik.values.file && formik.values.channels_ids.length && formik.values.products_ids.length && !isLoading

    return (
        <Box p={12}>
			<Typography variant={"h3"} fontWeight={"bolder"} ml={5} mb={5}>Датасеты</Typography>

            <DataGrid
                columns={datasetsCols}
                rows={datasets || []}

                hideFooter

                processRowUpdate={(updatedRow) => {

                    updateDataset(updatedRow)

                    return updatedRow
                }}

                disableColumnMenu

                onRowClick={({ id }) => navigate(`datasets/${id}`)}
            />



            <Box
                component="label"
                display="flex"

                height={220}

                alignItems="center"
                justifyContent="center"

                borderRadius={6}

                border={formik.values.file ? "" : "4px solid #93C5FD"}

                bgcolor={formik.values.file ? "#B9EAE4" : "#DBEAFE" }

                m={5}
            >
                {formik.values.file ? (
                    <Box display="flex" alignContent="center" gap={2}>
                        <Box>
                            <TableChartIcon style={{ width: 80, height: 80}}/>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h6" fontWeight="bold">
                                {`Загружен датасет: ${formik.values.file.name}`}
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                     <Box display="flex" flexDirection="column" justifyContent="center" textAlign="center">
                        <Box >
                            <TableChartIcon style={{ width: 80, height: 80, color: "#2563EB" }}/>
                        </Box>

                        <Typography variant="h6" fontWeight="bold">
                            Выберите файл датасета
                        </Typography>
                    </Box>
                )}




                <VisuallyHiddenInput
                    type='file'
                    name='photo'
                    accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    onChange={(e) =>
                        e.currentTarget.files && formik.setFieldValue('file', e.currentTarget.files[0])
                    }
                />
            </Box>

            {formik.values.file && (
                <Card>
                    <Box p={5}>

                        <Box display={"flex"} alignItems="center" mb={3}>
                            <Typography variant="h5" fontWeight="bold">{formik.values.file.name}</Typography>
                            <NavigateNextIcon fontSize="large"/>
                            <Typography variant="h5">Параметры генерации</Typography>
                        </Box>

                        <Grid container textAlign={"left"} spacing={5}>
                            <Grid xs={7}>

                                <Box mb={4}>
                                    <Typography color={grey[500]} variant="subtitle1" fontWeight="bold" textTransform="uppercase" mb={2}>Каналы связи</Typography>
                                    <DataGrid
                                        columns={channelCols}
                                        rows={channels || []}

                                        checkboxSelection

                                        hideFooter

                                        rowSelectionModel={formik.values.channels_ids}

                                        onRowSelectionModelChange={(newRowSelectionModel) => {
                                            formik.setFieldValue('channels_ids', newRowSelectionModel)
                                        }}

                                        processRowUpdate={(updatedRow) => {

                                            updateChannel(updatedRow)

                                            return updatedRow
                                        }}

                                        disableColumnMenu

                                        onProcessRowUpdateError={() => {}}
                                    />
                                </Box>

                                <Box>
                                    <Typography color={grey[500]} variant="subtitle1" fontWeight="bold" textTransform="uppercase" mb={2}>Продукты</Typography>
                                    <DataGrid
                                        columns={productCols}
                                        rows={products || []}

                                        checkboxSelection

                                        hideFooter

                                        rowSelectionModel={formik.values.products_ids}

                                        onRowSelectionModelChange={(newRowSelectionModel) => {
                                            formik.setFieldValue('products_ids', newRowSelectionModel)
                                        }}

                                        processRowUpdate={(updatedRow) => {

                                            updateProduct(updatedRow)

                                            return updatedRow
                                        }}

                                        disableColumnMenu
                                    />
                                </Box>

                            </Grid>
                            <Grid xs={5}>
                                <Box mb={4}>
                                    <InputWithSlider
                                    title={"Температура"}
                                    min={0} max={1}
                                    value={formik.values.temp}
                                    onUpdate={(value: number) => formik.setFieldValue("temp", value)}
                                />
                                <InputWithSlider
                                    title={"TOP-P"}
                                    min={0} max={1}
                                    value={formik.values.top_p}
                                    onUpdate={(value: number) => formik.setFieldValue("top_p", value)}
                                />
                                </Box>




                                <Button variant={"contained"} onClick={formik.submitForm} fullWidth disabled={!is_gen_allowed}>{isLoading ? "Идет генерация" : "Генерировать текст"}</Button>
                            </Grid>
                        </Grid>
                    </Box>

                </Card>
            )}
        </Box>
    );
};

export default Generator;