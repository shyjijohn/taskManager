import * as React from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import { styled, useTheme, alpha } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import InputBase from '@mui/material/InputBase';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useClerk } from '@clerk/clerk-react';

interface AppBarProps {
    OnCreateButtonClick: () => void;
}

const AppBarStyled = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<{}>(({ theme }) => ({
    height: 65,
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    })
}));


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const AppBar: React.FC<AppBarProps> = ({ OnCreateButtonClick: CreateTask }) => {

    const { signOut } = useClerk()

    const theme = useTheme();

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logoutUser = () => {
        signOut();
        handleCloseUserMenu();
    };

    return (
        <AppBarStyled position="fixed" sx={{ backgroundColor: '#D0312D' }}>
            <Toolbar>
                <Stack direction="row" spacing={1} justifyContent="left">
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ pt: 0.5, flexGrow: 1 }}
                    >
                        Task Manager
                    </Typography>
                </Stack>

                <Box sx={{ flexGrow: 1 }} />
                <Button variant="contained" sx={{ background: 'transparent', color: 'white' }} onClick={CreateTask}>
                    Create
                </Button>
                <Stack justifyContent="center" ml='2'>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </Stack>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconButton onClick={handleOpenUserMenu} size="large" edge="end" aria-label="account of current user" color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem key={"Logout"} onClick={logoutUser}>
                            <Typography sx={{ textAlign: 'center' }}>{"Logout"}</Typography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBarStyled>
    );
};

export default AppBar;
