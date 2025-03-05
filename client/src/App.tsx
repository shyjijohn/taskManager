import KanbanBoard from "./components/KanbanBoard";
import { Container, Toolbar } from "@mui/material";
import AppBar from './components/Appbar';
import { useEffect, useState } from "react";
import CreatePopup from "./components/CreatePopup";

import { Task } from "./types/Task";
import { createTask, deleteTask, getTasks, updateTaskStatus } from "./api";

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch(err => console.log(err.message));
  }, []);

  const [openCreatePopup, setOpenCreatePopup] = useState(false);

  const handleAppBarCreateButtonClick = () => {
    setOpenCreatePopup(true);

  };

  const handleCloseCreatePopup = () => {
    setOpenCreatePopup(false);
  };

  const handleDrop = (id: string, newStatus: Task["status"]) => {
    updateTaskStatus(id, newStatus)
      .then((task) => {
        console.log("Updated:", task)
        getTasks()
          .then(setTasks)
          .catch(console.error);

      })
      .catch(console.error);
  };


  const handleCreateTask = (taskData: Task) => {

    if (taskData.title.trim() !== "") {
      createTask(taskData)
        .then((task) => {
          console.log("Created:", task)
          getTasks()
            .then(setTasks)
            .catch(err => console.log(err.message));

        })
        .catch(console.error);
    }

    handleCloseCreatePopup();
  };


  const handleDeleteTask = (taskData: Task) => {

    deleteTask(taskData.id)
      .then(response => console.log(response.message))
      .catch(console.error);

    getTasks()
      .then(setTasks)
      .catch(err => console.log(err.message));

  };


  return (
    <div>
      <AppBar OnCreateButtonClick={handleAppBarCreateButtonClick} />
      <Toolbar />
      <KanbanBoard tasks={tasks} handleDrop={handleDrop} handleDeleteTask={ handleDeleteTask}/>
      <CreatePopup
        open={openCreatePopup}
        handleClose={handleCloseCreatePopup}
        handleCreate={handleCreateTask}
      />
    </div>
  );
}

export default App
