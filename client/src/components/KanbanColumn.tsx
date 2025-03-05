import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { useDrop } from "react-dnd";
import { Task } from "../types/Task";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
    title: string;
    status: "todo" | "in-progress" | "done";
    tasks: Task[];
    onDrop: (id: string, newStatus: Task["status"]) => void;
    onDelete: (taskData: Task) => void
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, tasks, onDrop, onDelete }) => {
      const [{ isOver }, drop] = useDrop(() => ({
        accept: "TASK",
        drop: (item: { id: string }) => onDrop(item.id, status),
        collect: (monitor) => ({
          isOver: !!monitor.isOver(),
        }),
      }));

    return (
        <Paper
            ref={drop} 
            sx={{ p: 2, minWidth: 250, minHeight: 400, bgcolor: isOver ? "lightgray" : "white" }}>
            <Typography variant="body1">{title}</Typography>
            <Box mt={2}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onDelete={onDelete} />
                ))}
            </Box>
        </Paper>
    );
};

export default KanbanColumn;
