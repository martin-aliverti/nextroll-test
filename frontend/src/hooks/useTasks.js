import React, { useState, useContext, createContext, useEffect } from "react";
import moment from "moment";
import TasksService from "../services/TaskService";

const tasksContext = createContext();

export const ProvideTasks = ({ children }) => {
  const tasks = useProvideTasks();
  return (
    <tasksContext.Provider value={tasks}>{children}</tasksContext.Provider>
  );
};

export const useTasks = () => useContext(tasksContext);

const completedSamples = [
  {
    id: 1,
    text: "Set up authentication",
    dueDate: moment().add(5, "days"),
    priority: 5,
    completed: true,
  },
  {
    id: 4,
    text: "Configure nginx",
    dueDate: moment(),
    priority: 9,
    completed: true,
  },
];

const pendingSamples = [
  {
    id: 2,
    text: "Responsive design",
    dueDate: moment(),
    priority: 4,
    completed: false,
  },
  {
    id: 3,
    text: "enable https in future releases and this is a rather longer text",
    dueDate: moment().add(8, "months"),
    priority: 2,
    completed: false,
  },
];

const useProvideTasks = () => {
  const [completed, setCompleted] = useState(completedSamples);
  const [pending, setPending] = useState(pendingSamples);
  const { listTasks, createTask, deleteTask, updateTask } = TasksService();

  const _listTasks = async () => {
    const tasks = await listTasks();
    const completedTasks = [];
    tasks.filter((task) => task.completed);
    const pendingTasks = [];
    tasks.forEach((task) =>
      task.completed ? completedTasks.push(task) : pendingTasks.push(task)
    );
    setCompleted(completedTasks);
    setPending(pendingTasks);
  };

  const _createTask = async (task) => {
    await createTask(task);
    await _listTasks();
  };

  const _deleteTask = async (task) => {
    await deleteTask(task);
    await _listTasks();
  };

  const completeTask = async (task) => {
    await updateTask(task);
    await _listTasks();
  };

  useEffect(() => {
    _listTasks();
  }, []);

  return {
    completed,
    pending,
    completeTask,
    listTasks: _listTasks,
    createTask: _createTask,
    deleteTask: _deleteTask,
  };
};
