import React from "react";
import { ProvideTasks } from "../../hooks/useTasks";
import TaskList from "./TaskList";

export default () => (
  <ProvideTasks>
    <TaskList />
  </ProvideTasks>
);
