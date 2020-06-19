import React, { useState } from "react";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import { TextField, Button } from "@material-ui/core";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import { useTasks } from "../../hooks/useTasks";
import useForm from "../../hooks/useForm";

export default () => {
  const [collapsed, setCollapsed] = useState(true);
  const [date, setDate] = useState(moment());
  const { createTask } = useTasks();
  const [task, handleChange, reset] = useForm({
    text: "",
    priority: "0",
  });
  const resetForm = () => {
    reset();
    setDate(moment());
    setCollapsed(true);
  };
  const create = () => {
    createTask({ ...task, dueDate: date });
    resetForm();
  };
  return collapsed
    ? displayCollapsed({ expand: () => setCollapsed(false) })
    : displayExpanded({ task, date, setDate, handleChange, create, resetForm });
};

const displayCollapsed = ({ expand }) => (
  <Button
    color="primary"
    variant="contained"
    style={styles.newTaskButton}
    onClick={expand}
  >
    New Task
  </Button>
);

const displayExpanded = ({
  task,
  date,
  setDate,
  handleChange,
  create,
  resetForm,
}) => (
  <div style={styles.container}>
    <IconButton
      style={{ alignSelf: "flex-end" }}
      size="small"
      color="primary"
      onClick={resetForm}
    >
      <DeleteIcon />
    </IconButton>
    <TextField
      variant="outlined"
      value={task.text}
      onChange={handleChange}
      name="text"
      multiline
    />
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          variant="inline"
          format="yyyy/MM/dd"
          margin="normal"
          label={"Due date"}
          value={date}
          onChange={(newDate) => setDate(moment(newDate))}
          minDate={moment()}
        />
      </MuiPickersUtilsProvider>
      <TextField
        style={{ width: 40 }}
        label="Priority"
        name="priority"
        value={task.priority}
        onChange={handleChange}
        type="number"
      />
    </div>
    <Button
      color="primary"
      variant="contained"
      disableElevation
      style={{ alignSelf: "flex-end", marginTop: 10 }}
      onClick={create}
      disabled={!task.text}
    >
      Add
    </Button>
  </div>
);

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
  newTaskButton: {
    width: "100%",
  },
};
