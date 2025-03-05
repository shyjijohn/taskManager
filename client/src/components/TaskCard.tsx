import React, { useState } from "react";
import { Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import { useDrag } from "react-dnd";
import { Task } from "../types/Task";
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";


interface TaskCardProps {
    task: Task;
    onDelete: (taskData: Task) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "TASK",
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));


    const [openDialog, setOpenDialog] = useState<boolean>(false);


    const handleOpenDialog = () => {
        setOpenDialog(true);
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    
    const handleDelete = () => {
        onDelete({
            id: task.id,
            title: task.title,
            status: task.status
        });  
        
        setOpenDialog(false); 
    };

    return (
        <Card ref={dragRef}
            sx={{ opacity: isDragging ? 0.01 : 1, 
                mb: 1, p: 1 }}>
            <CardContent>
                <Stack display="flex" flexDirection="row" justifyContent="space-between">
                    <Typography variant="body2">{task.title}</Typography>
                    <IconButton color="error">
                        <DeleteIcon onClick={handleOpenDialog} />
                    </IconButton>
                </Stack>
            </CardContent>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
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
