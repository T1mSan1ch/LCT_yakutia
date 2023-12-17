import {createRoot} from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import { Provider } from 'react-redux'

import {createTheme, responsiveFontSizes, ThemeProvider} from "@mui/material";

import Generator from "./pages/Generator";
import Dataset from "./pages/Dataset";

import {store} from "./app/store";


const theme = responsiveFontSizes(createTheme({
    palette: {
        primary: {
            main: "#2563EB"
        },
        success: {
            main: "#5ACDC1"
        },
        error: {
            main: "#FF7270"
        }
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16
                }
            },
            defaultProps: {
                variant: "outlined"
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 16
                }
            }
        },
        //@ts-ignore
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
                cell: {
                    borderBottom: "none"
                }
            }
        },
        MuiCheckbox: {
            styleOverrides: {

            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    background: "#faf9fc"
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: "none"
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    '&:before': {
                        display: 'none',
                    }
                }
            }
        }
    }
}));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Generator />
    },
    {
        path: "/datasets/:datasetId",
        element: <Dataset />,
    }
]);

createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <Provider store={store}>
      <ThemeProvider theme={theme}>
          <RouterProvider router={router}/>
      </ThemeProvider>
  </Provider>
);
