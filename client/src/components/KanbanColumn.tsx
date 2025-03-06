import React from "react";
import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { useDrop } from "react-dnd";
import { Task } from "../types/Task";
import TaskCard from "./TaskCard";
import AddIcon from '@mui/icons-material/Add';

interface KanbanColumnProps {
    title: string;
    status: "todo" | "in-progress" | "done";
    tasks: Task[];
    onDrop: (id: string, newStatus: Task["status"]) => void;
    onDelete: (taskData: Task) => void
    OnTaskEditButtonClick: (taskData: Task) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, tasks, onDrop, onDelete, OnTaskEditButtonClick }) => {
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
            sx={{
                p: 2,
                minWidth: 250,
                bgcolor: isOver ? 'lightgrey' : 'whitesmoke',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Typography variant="body1">{title}</Typography>
            <Divider sx={{ marginTop: 1 }} />
            <Box mt={2}>
                {tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onDelete={onDelete} OnTaskEditButtonClick={OnTaskEditButtonClick} />
                ))}
            </Box>
        </Paper>
    );
};

export default KanbanColumn;
