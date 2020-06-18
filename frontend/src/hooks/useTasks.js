import React, { useState, useContext, createContext, useEffect } from "react";
import TasksService from "../services/TaskService";

const tasksContext = createContext();

export const ProvideTasks = ({ children }) => {
  const tasks = useProvideTasks();
  return (
    <tasksContext.Provider value={tasks}>{children}</tasksContext.Provider>
  );
};

export const useTasks = () => useContext(tasksContext);

const useProvideTasks = () => {
  const [tasks, setTasks] = useState([]);
  const { listTasks, createTask, deleteTask, updateTask } = TasksService();

  const _listTasks = async () => {
    const tasks = await listTasks();
    setTasks(tasks);
  };

  const _createTask = async (task) => {
    await createTask(task);
    setTasks([...tasks, task]);
  };

  const _deleteTask = async (task) => {
    await deleteTask(task);
    setTasks(tasks.filter((listedTask) => listedTask !== task));
  };

  useEffect(() => {
    _listTasks();
  }, []);

  return {
    tasks,
    setTasks,
    listTasks: _listTasks,
    createTask: _createTask,
    deleteTask: _deleteTask,
  };
};
