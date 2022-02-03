const theme = {
    palette: {
        mode: "light",
        primary: {
            main: '#4BAEA6',
            contrastText: '#fff',
        },
        secondary: {
            main: '#3e857f',
        },
        error: {
            main: '#f44336',
        },
        background: {
            // default: '#f5f8ff'
            default: '#ffffff'
        },
    },
    colors: {
        base2: "#fff",
        navButton: "rgba(0, 0, 0, 0.87)",
        navButtonHover: "#ff992b",
        primarycolor: "#0097a7",
        primary1: "#143438",
        textColor: "#FFF",
        base1: "#f5f8ff", //dirty white for guide component,
        btnColor: "#ebae2d",
        buttonColor: "#1a90d9",
        buttonHover: "#6fb7e3",
        colorsuccess: '#00f230',
    },
    typography: {
        fontFamily: [
            "Open Sans",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"'
        ].join(",")
    },
    button: {
        MuiButton: {
          styleOverrides: {
            root: {
              color: '#fff',
            },
          },
        },
      },
};


export default theme;