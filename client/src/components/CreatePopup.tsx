import React, { useState } from 'react';
import {
    AppBar,
    IconButton,
    Toolbar,
    Badge,
    TextField,
    Button,
    Box,
    Modal,
    Typography,
    Stack,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Task } from '../types/Task';

import { v4 as uuidv4 } from "uuid";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

interface TaskModalProps {
    open: boolean;
    handleClose: () => void;
    handleCreate: (taskData : Task) => void;
}

const CreatePopup: React.FC<TaskModalProps> = ({ open, handleClose, handleCreate }) => {

    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDate, setTaskDate] = useState('');

    const handleSubmit = () => {
        
        handleCreate({
            id: uuidv4(), 
            title: taskName,
            status: 'todo'
        });
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={{ ...modalStyle }}>
                <Typography variant="h6" gutterBottom>Create Task</Typography>
                <Stack spacing={2}>
                    <TextField
                        label="Task Name"
                        variant="outlined"
                        fullWidth
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                    />
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                    />
                    <TextField
                        label="Due Date"
                        variant="outlined"
                        fullWidth
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button color="primary" onClick={handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleSubmit}>
                            Create
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
};

export default CreatePopup