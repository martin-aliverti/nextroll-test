import React from "react";
import Task from "./Task";
import { Typography } from "@material-ui/core";
import NewTask from "./NewTask";

export default ({ title, tasks }) => (
  <div style={styles.container}>
    <Typography style={styles.title} variant="h5">
      {title}
    </Typography>
    {tasks.map((task) => (
      <Task task={task} />
    ))}
    <NewTask />
  </div>
);

const styles = {
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
  },
  title: {
    color: "#fff",
  },
};
