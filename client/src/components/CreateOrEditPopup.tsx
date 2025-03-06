import React, { useEffect, useState } from 'react';
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
    edit: boolean;
    taskToEdit: Task | undefined;
    handleClose: () => void;
    handleCreate: (taskData: Task) => void;
    handleEdit: (taskData: Task) => void;
}

const CreateOrEditPopup: React.FC<TaskModalProps> = (props) => {

    const [taskName, setTaskName] = useState(props.taskToEdit ? props.taskToEdit.title : '');
    const [taskDescription, setTaskDescription] = useState(props.taskToEdit ? props.taskToEdit.description : '');

    // console.log("Props", props, taskName, taskDescription)
    // console.log("taskName", taskName, taskDescription)
    // console.log("taskDescription", taskDescription)


    useEffect(() => {
        if (props.edit && props.taskToEdit) {
            setTaskName(props.taskToEdit.title);
            setTaskDescription(props.taskToEdit.description);
        }
    }, [props.edit, props.taskToEdit]);
    
    const handleSubmit = () => {

        if (props.edit) {
            props.handleEdit({
                id: props.taskToEdit ? props.taskToEdit.id : uuidv4(),
                title: taskName,
                description: taskDescription,
                status: props.taskToEdit ? props.taskToEdit.status : 'todo'
            })
        }
        else {
            props.handleCreate({
                id: uuidv4(),
                title: taskName,
                description: taskDescription,
                status: 'todo'
            });
        }
        props.handleClose();
    };

    return (
        <Modal open={props.open} onClose={props.handleClose}>
            <Box sx={{ ...modalStyle }}>

                <Typography variant="h6" gutterBottom>{props.edit ? "Edit Task" : "Create Task"} </Typography>
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

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button color="primary" onClick={props.handleClose}>Cancel</Button>
                        <Button color="secondary" onClick={handleSubmit}>
                            {props.edit ? "Edit" : "Create"}
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
};

export default CreateOrEditPopup