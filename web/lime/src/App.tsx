import * as React from "react";
import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Titlebar, ViderPlayerContainer } from "@/components";
import Container from "@mui/material/Container";
import HomePage from "./pages/HomePage";
import { Switch, Route, Redirect, MemoryRouter } from "react-router-dom";
import DrivePage from "./pages/DrivePage";
import TorrentPage from "./pages/TorrentPage";
import { useRecoilState } from "recoil";
import { googleOAuthRefreshToken } from "@/store";
import SignInPage from "./pages/SignInPage";
import { platform } from "./platform/electron";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#066aff",
    },
    secondary: {
      main: "#2ec5d3",
    },
    background: {
      default: "#192231",
      paper: "#24344d",
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default function App() {
  const [refreshToken, setRefreshToken] = useRecoilState(
    googleOAuthRefreshToken
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: "background.default",
          height: "100vh",
          width: "100%",
        }}
      >
        {refreshToken ? (
          <Container
            maxWidth={false}
            sx={{
              width: "100%",
              height: "100vh",
              overflow: "auto",
              paddingTop: "5px",
            }}
          >
            <MemoryRouter>
              <Switch>
                <Route exact={true} path="/" component={HomePage} />
                <Route exact={true} path="/drive" component={DrivePage} />
                <Route exact={true} path="/torrent" component={TorrentPage} />
                <Route render={() => <Redirect to="/" />} />
              </Switch>
            </MemoryRouter>
            <ViderPlayerContainer />
          </Container>
        ) : (
          <SignInPage />
        )}
      </Box>
    </ThemeProvider>
  );
}
