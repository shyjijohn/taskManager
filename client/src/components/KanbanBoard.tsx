import React, { useState } from "react";
import { Box, Grid, Button, TextField } from "@mui/material";
import KanbanColumn from "./KanbanColumn";
import { v4 as uuidv4 } from "uuid";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task } from "../types/Task";

interface KanbanBoardProps {
    tasks: Task[];
    handleDrop: (id: string, newStatus: Task["status"]) => void;
    handleDeleteTask: (taskData: Task) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, handleDrop, handleDeleteTask}) => {

    return (
        <DndProvider backend={HTML5Backend}>
            <Box p={2}>
                <Grid container spacing={2} wrap="nowrap">
                    {["todo", "in-progress", "done"].map((status) => (
                        <Grid item key={status}>
                            <KanbanColumn
                                title={status.replace("-", " ").toUpperCase()}
                                status={status as Task["status"]}
                                tasks={tasks.filter((task) => task.status === status)}
                                onDrop={handleDrop}
                                onDelete={handleDeleteTask}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </DndProvider>
    );
};

export default KanbanBoard;
