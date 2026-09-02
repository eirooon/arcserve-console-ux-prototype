import { createTheme } from "@mui/material/styles";

export const ARC_NAV_BG = "#001A70";
const LIGHT_BG = "#ffffff";
const DARK_BG = "#121212";

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        background: { default: LIGHT_BG, paper: LIGHT_BG },
        primary: {
          light: "#BB86FC",
          main: "#8A2BFF",
          dark: "#640FCD",
          contrastText: "#FFFFFF",
        },
        secondary: {
          light: "#66C8E9",
          main: "#00729A",
          dark: "#0A5F7C",
          contrastText: "#FFFFFF",
        },
      },
    },
    dark: {
      palette: {
        background: { default: DARK_BG, paper: DARK_BG },
        primary: {
          // We swap the 'light' color to become the 'main' for dark mode
          main: "#BB86FC",
          light: "#D7B7FD",
          dark: "#8A2BFF",
          contrastText: "rgba(0, 0, 0, 0.87)", // Dark text on light primary
        },
        secondary: {
          main: "#66C8E9",
          light: "#99DFF4",
          dark: "#00729A",
          contrastText: "rgba(0, 0, 0, 0.87)",
        },
        text: {
          primary: "#ffffff",
          secondary: "rgba(255, 255, 255, 0.7)",
        },
      },
    },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif", "Roboto", "Helvetica", "Arial"].join(),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "Inter, sans-serif, Roboto, Helvetica, Arial",
        },
        "@media (prefers-reduced-motion: reduce)": {
          "*": {
            animationDuration: "0.01ms !important",
            animationIterationCount: "1 !important",
            transitionDuration: "0.01ms !important",
            scrollBehavior: "auto !important",
          },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "transparent",
          boxShadow: "none",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: ARC_NAV_BG,
          color: "rgba(255,255,255,0.92)",
          borderRight: "none",
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          borderColor: "#eeeeee",
          padding: "8px",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          paddingBottom: "0px",
        },
        title: {
          fontSize: "1.25rem",
          fontWeight: 700,
        },
        subheader: {
          fontSize: "0.875rem",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          "&:last-child": {
            paddingBottom: 16,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },

    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: "none",
          height: "calc(100vh - 137px)",
        },
        filler: {
          bgColor: "#333",
        },
      },
    },
  },
});
