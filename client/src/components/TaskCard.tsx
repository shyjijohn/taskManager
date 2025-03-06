import React, { useState } from "react";
import { Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import { useDrag } from "react-dnd";
import { Task } from "../types/Task";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";


interface TaskCardProps {
    task: Task;
    onDelete: (taskData: Task) => void
    OnTaskEditButtonClick: (taskData: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, OnTaskEditButtonClick }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "TASK",
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));


    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

    const handleEditOpenDialog = () => {
        setOpenEditDialog(true);
    };

    const handleEditCloseDialog = () => {
        setOpenEditDialog(false);
    };

    const handleOpenDialog = () => {
        setOpenDeleteConfirmDialog(true);
    };


    const handleCloseDialog = () => {
        setOpenDeleteConfirmDialog(false);
    };


    const handleDelete = () => {
        onDelete(task);
        setOpenDeleteConfirmDialog(false);
    };


    const handleEditButtonClick= () => {
        OnTaskEditButtonClick(task);
    };

    return (
        <Card ref={dragRef}
            sx={{
                opacity: isDragging ? 0.01 : 1,
                mb: 1, p: 1
            }}>
            <CardContent sx={{ position: 'relative', paddingBottom: '50px' }}> {/* Add padding to allow space for buttons */}
                {/* Title with larger font size and distinct style */}
                <Typography variant="body1" sx={{ marginBottom: '8px' }}>
                    {task.title}
                </Typography>

                {/* Stack for the text content */}
                <Stack display="flex" flexDirection="row" justifyContent="space-between" sx={{ marginBottom: '40px' }}>
                    {/* Description with normal styling */}
                    <Typography variant="body2">
                        {task.description}
                    </Typography>
                </Stack>

                {/* Buttons aligned to the bottom-right */}
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        padding: '8px',
                        justifyContent: 'flex-end',
                    }}
                >
                    <IconButton color="error" onClick={handleEditButtonClick}>
                        <EditIcon color="primary" />
                    </IconButton>
                    <IconButton color="error" onClick={handleOpenDialog}>
                        <DeleteIcon />
                    </IconButton>
                </Stack>
            </CardContent>

            <Dialog open={openDeleteConfirmDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete this task?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default TaskCard;
