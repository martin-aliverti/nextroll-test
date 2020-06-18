import React from "react";
import { useTheme, Typography, CircularProgress } from "@material-ui/core";
import { useAuth } from "../../hooks/useProvideAuth";

export default ({ fields, actions, flipBackground }) => {
  const theme = useTheme();
  const { loading } = useAuth();
  return (
    <div
      style={{
        ...styles.container,
        background: getBackground(theme, flipBackground),
      }}
    >
      <div style={styles.contents}>
        <div style={styles.block}>
          <div style={styles.logoContainer}>
            <Typography variant="h4">Ultimate ToDo List!</Typography>
          </div>
          <div style={styles.fieldsContainer}>{fields}</div>
        </div>
        <div style={styles.block}>
          <div style={styles.buttonsContainer}>{actions}</div>
          <div style={styles.loaderContainer}>
            {loading && <CircularProgress color="primary" />}
          </div>
        </div>
      </div>
    </div>
  );
};

const getBackground = (theme, flipBackground) =>
  flipBackground
    ? `linear-gradient(${theme.palette.primary.light},${theme.palette.primary.main})`
    : `linear-gradient(${theme.palette.primary.main},${theme.palette.primary.light})`;

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  contents: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: 400,
    height: 550,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  block: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  fieldsContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: 10,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    padding: 10,
  },
  logoContainer: {
    display: "flex",
    height: 200,
    alignItems: "center",
  },
  loaderContainer: {
    height: 10,
  },
};
