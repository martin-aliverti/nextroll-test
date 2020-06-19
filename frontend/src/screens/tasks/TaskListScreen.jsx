import React from "react";
import { ProvideTasks } from "../../hooks/useTasks";
import { useTheme } from "@material-ui/core";
import AllLists from "./AllLists";
import Header from "../../components/Header";

export default () => {
  const theme = useTheme();
  return (
    <>
      <Header />
      <div style={{ ...styles.container, background: getBackground(theme) }}>
        <ProvideTasks>
          <AllLists />
        </ProvideTasks>
      </div>
    </>
  );
};

const getBackground = (theme) =>
  `linear-gradient(${theme.palette.primary.light},${theme.palette.primary.main})`;

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 40,
  },
};
