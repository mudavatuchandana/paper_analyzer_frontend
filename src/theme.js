// // src/theme.js
// import { createTheme } from "@mui/material/styles";

// export const theme = createTheme({
//   palette: {
//     mode: "light",

//     primary: {
//       main: "#4F2170", // Deep Purple
//       contrastText: "#FFFFFF",
//     },

//     secondary: {
//       main: "#FFD43B", // Gold
//       contrastText: "#4F2170",
//     },

//     background: {
//       default: "#F8F5FC", // very light lavender
//       paper: "#FFFFFF",
//     },

//     text: {
//       primary: "#34144A", // deep accent purple
//       secondary: "#4F2170",
//     },
//   },

//   shape: {
//     borderRadius: 12,
//   },

//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',

//     h6: {
//       fontWeight: 700,
//       color: "#4F2170",
//     },

//     h5: {
//       fontWeight: 700,
//       color: "#4F2170",
//     },
//   },

//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           fontWeight: 600,
//           borderRadius: 10,
//           padding: "8px 20px",
//         },
//       },
//     },

//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           padding: "24px",
//           backgroundColor: "#FFFFFF",
//           borderRadius: 16,
//           border: "1px solid #C5B4D355", // soft lavender border
//         },
//       },
//     },

//     MuiAlert: {
//       styleOverrides: {
//         root: {
//           borderRadius: 12,
//         },
//       },
//     },
//   },
// });

// src/theme.js
// src/theme.js
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#7A0019", // UMN Maroon
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#FFCC33", // UMN Gold (accents only)
      contrastText: "#7A0019",
    },

    background: {
      default: "#f7f7f7ff", // modern neutral
      paper: "#FFFFFF",
    },

    text: {
      primary: "#5B0011",
      secondary: "#7A0019",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700, color: "#7A0019" },
    h6: { fontWeight: 700, color: "#7A0019" },
  },

  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E0E0E0 !important", // clean neutral line
          backgroundColor: "#FFFFFF",
          color: "#7A0019",
          boxShadow: "none",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "24px",
          borderRadius: 12,
          backgroundColor: "#FFFFFF",
          border: "1px solid #DDDDDD", // soft neutral border
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 10,
          padding: "8px 20px",
        },
      },
    },
  },
});
