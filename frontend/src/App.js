import React from "react";
import { Router } from "@reach/router";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { LocationProvider } from "@reach/router";
import TaskListScreen from "./screens/tasks/TaskListScreen";
import LoginScreen from "./screens/authentication/LoginScreen";
import RegisterScreen from "./screens/authentication/RegisterScreen";
import { ProvideAuth } from "./hooks/useProvideAuth";
import { ProvideSessionRedirect } from "./hooks/useSessionRedirection";
import { ProvideSession } from "./hooks/useSession";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4974a5",
      light: "#A4B9D2",
      dark: "#2B4563",
    },
    secondary: {
      main: "#fff",
      light: "#fff",
      dark: "#29282E",
    },
  },
});

export default () => (
  <ProvideSession>
    <LocationProvider>
      <ProvideSessionRedirect>
        <ProvideAuth>
          <ThemeProvider theme={theme}>
            <Router>
              <TaskListScreen path="/" />
              <LoginScreen path="/login" />
              <RegisterScreen path="/register" />
            </Router>
          </ThemeProvider>
        </ProvideAuth>
      </ProvideSessionRedirect>
    </LocationProvider>
  </ProvideSession>
);
