import KanbanBoard from "./components/KanbanBoard";
import { Box, Container, Toolbar } from "@mui/material";
import AppBar from './components/Appbar';
import { useEffect, useState } from "react";
import CreateOrEditPopup from "./components/CreateOrEditPopup";

import { Task } from "./types/Task";
import { createTask, deleteTask, getTasks, updateTask, updateTaskStatus } from "./api";
import { SignIn, useAuth, useUser } from "@clerk/clerk-react";

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [isEditTask, setIsEditTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>();
  const { isSignedIn, isLoaded, user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    getTasks(getToken)
      .then(setTasks)
      .catch(err => console.log(err.message));
  }, []);


  const handleAppBarCreateButtonClick = () => {
    setIsEditTask(false);
    setOpenCreatePopup(true);

  };

  const handleTaskEditButtonClick = (taskE: Task) => {
    setTaskToEdit(taskE);
    setIsEditTask(true);
    setOpenCreatePopup(true);

  };

  const handleCloseCreatePopup = () => {
    setOpenCreatePopup(false);
  };

  const handleDrop = (id: string, newStatus: Task["status"]) => {
    updateTaskStatus(id, newStatus, getToken)
      .then((task) => {
        console.log("Updated:", task)
        getTasks(getToken)
          .then(setTasks)
          .catch(console.error);

      })
      .catch(console.error);
  };


  const handleCreateTask = (taskData: Task) => {

    if (taskData.title.trim() !== "") {
      createTask(taskData, getToken)
        .then((task) => {
          console.log("Created:", task)
          getTasks(getToken)
            .then(setTasks)
            .catch(err => console.log(err.message));

        })
        .catch(console.error);
    }

    handleCloseCreatePopup();
  };
  const handleEdit = (taskData: Task) => {

    if (taskData.title.trim() !== "") {

      updateTask(taskData, getToken)
        .then(() => {
          getTasks(getToken)
            .then(setTasks)
            .catch(err => console.log(err.message));

        })
        .catch(console.error);
    }

    handleCloseCreatePopup();
  };

  const handleDeleteTask = (taskData: Task) => {

    deleteTask(taskData.id, getToken)
      .then((response) => {
        console.log(response.message)
        getTasks(getToken)
          .then(setTasks)
          .catch(err => console.log(err.message));

      })
      .catch(console.error);
  };


  return (
    <>
      {isSignedIn ?
        (
          <div>
            <AppBar OnCreateButtonClick={handleAppBarCreateButtonClick} />
            <Toolbar />
            <KanbanBoard tasks={tasks} handleDrop={handleDrop} handleDeleteTask={handleDeleteTask} OnTaskEditButtonClick={handleTaskEditButtonClick} />
            <CreateOrEditPopup
              edit={isEditTask}
              open={openCreatePopup}
              taskToEdit={taskToEdit}
              handleClose={handleCloseCreatePopup}
              handleCreate={handleCreateTask}
              handleEdit={handleEdit}
            />
          </div>
        ) :
        (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="#f4f4f4"
          >
            <SignIn />
          </Box>
        )
      }

    </>
  );
}

export default App
