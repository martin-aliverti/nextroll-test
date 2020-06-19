import React from "react";
import { Typography, Divider, Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import { useTasks } from "../../hooks/useTasks";

export default ({ task }) => {
  const { completeTask, deleteTask } = useTasks();
  return (
    <div style={styles.container}>
      <div style={styles.actions}>
        <IconButton size="small" color="primary" onClick={() => {}}>
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          color="primary"
          onClick={() => deleteTask(task)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
      <Typography variant="body1">{task.text}</Typography>
      <Divider style={{ marginTop: 5, marginBottom: 5 }} />
      <Typography variant="body2">{`Due date: ${task.dueDate.format(
        "LL"
      )}`}</Typography>
      <Typography variant="body2">{`Priority: ${task.priority}`}</Typography>
      {!task.completed && (
        <Button
          color="primary"
          variant="contained"
          disableElevation
          style={{ alignSelf: "flex-end" }}
          onClick={() => completeTask(task)}
        >
          Done
        </Button>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 250,
  },
  actions: {
    alignSelf: "flex-end",
  },
};
