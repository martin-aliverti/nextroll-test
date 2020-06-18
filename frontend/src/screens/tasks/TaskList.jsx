import React from "react";
import { useTasks } from "../../hooks/useTasks";

export default () => {
  const { tasks } = useTasks();
  console.log(tasks);
  return <div>a lala lala lom</div>;
};
