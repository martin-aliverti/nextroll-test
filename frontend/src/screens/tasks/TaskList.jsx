import React, { useState, useEffect } from "react";
import Task from "./Task";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/MoreHoriz";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import NewTask from "./NewTask";

const ORDER_BY = {
  CONTENTS: "text",
  DATE: "dueDate",
  PRIORITY: "priority",
};

const orderBy = (tasks, property) =>
  tasks.sort((a, b) => (a[property] < b[property] ? -1 : 1));

export default ({ title, tasks }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [orderedTasks, setOrderedTasks] = useState(tasks);
  const [orderCriteria, setOrderCriteria] = useState([ORDER_BY.PRIORITY]);

  useEffect(() => {
    setOrderedTasks(orderBy(tasks, orderCriteria));
  }, [tasks, orderCriteria]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSort = (criteria) => {
    handleClose();
    setOrderCriteria(criteria);
  };
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Typography style={styles.title} variant="h5">
          {title}
        </Typography>
        <IconButton size="small" color="secondary" onClick={handleClick}>
          <MenuIcon />
        </IconButton>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleSort(ORDER_BY.CONTENTS)}>
            Sort by contents
          </MenuItem>
          <MenuItem onClick={() => handleSort(ORDER_BY.DATE)}>
            Sort by date
          </MenuItem>
          <MenuItem onClick={() => handleSort(ORDER_BY.PRIORITY)}>
            Sort by priority
          </MenuItem>
        </Menu>
      </div>
      {orderedTasks.map((task) => (
        <Task key={`task_${task.id}`} task={task} />
      ))}
      <NewTask />
    </div>
  );
};

const styles = {
  container: {
    width: 270,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 10,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    alignItems: "center",
  },
  title: {
    color: "#fff",
  },
};
