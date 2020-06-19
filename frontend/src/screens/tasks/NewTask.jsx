import React, { useState } from "react";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import { TextField, Button } from "@material-ui/core";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { useTasks } from "../../hooks/useTasks";
import useForm from "../../hooks/useForm";

export default () => {
  const [date, setDate] = useState(moment());
  const { createTask } = useTasks();
  const [task, handleChange] = useForm({
    text: "",
    priority: 0,
    completed: false,
  });
  const reset = () => {
    handleChange({ target: { value: "", name: "text" } });
    setDate(moment());
  };
  const create = () => {
    createTask({ ...task, dueDate: date });
    reset();
  };
  return (
    <div style={styles.container}>
      <TextField
        variant="outlined"
        value={task.text}
        onChange={handleChange}
        name="text"
        multiline
      />
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
      <Button
        color="primary"
        variant="contained"
        disableElevation
        style={{ alignSelf: "flex-end", marginTop: 10 }}
        onClick={create}
      >
        Add
      </Button>
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
};
