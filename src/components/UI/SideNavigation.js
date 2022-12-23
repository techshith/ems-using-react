// src/components/SideNavigation.js
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Divider,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert
} from '@mui/material';
import { FaHome, FaUsers, FaBell, FaChartBar, FaCog, FaBars, FaTimes, FaUserEdit, FaSignOutAlt, FaCodeBranch } from 'react-icons/fa';
import Profile from './Profile';
import './Nav.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import logo from '../../assets/images/logo.webp';
import '../../App.css'



const navItems = [
    { label: 'Home', icon: <FaHome color='white' />, path: '/home' },
    { label: 'Employees', icon: <FaUsers color='white' />, path: '/list' },
    { label: 'Notifications', icon: <FaBell color='white' />, path: '#' },
    { label: 'Reports', icon: <FaChartBar color='white' />, path: '#' },
    { label: 'Employee Hierachy', icon: <FaCodeBranch color='white' />, path: '#' },
];

const SideNavigation = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);


    const toggleSideNav = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleScrollToElement = () => {
            const element = document.getElementById(location.hash.slice(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        };

        handleScrollToElement();
    }, [location.hash]);

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        // Close the snackbar after a delay (e.g., 2 seconds)
        let timer;
        if (snackbarOpen) {
            timer = setTimeout(() => setSnackbarOpen(false), 2000);
        }

        return () => clearTimeout(timer); // Cleanup the timer on component unmount

    }, [snackbarOpen]);

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            // Show success snackbar
            setSnackbarOpen(true);
            // Close the dialog after a delay (e.g., 2 seconds)
            setTimeout(() => setLogoutDialogOpen(false), 2000);
            // Redirect to the home page after signing out after the delay
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };



    return (
        <div>

            <AppBar position="fixed" className="app-bar">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSideNav}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </IconButton>
                    <Profile />
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={isOpen} onClose={toggleSideNav}>
                <div className="drawer-content">

                    <img src={logo} alt="Logo" className="logo" />

                    <Divider />
                    <List>
                        {navItems.map((item) => (
                            <ListItem
                                key={item.label}
                                button
                                component={RouterLink}
                                to={item.path}
                                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            >
                                <ListItemIcon className="icon">{item.icon}</ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                    <List>
                        <ListItem button component={RouterLink} to="#">
                            <ListItemIcon className="icon">
                                <FaUserEdit color='white' />
                            </ListItemIcon>
                            <ListItemText primary="Edit Profile" />
                        </ListItem>
                        <ListItem button component={RouterLink} to="#">
                            <ListItemIcon className="icon">
                                <FaCog color='white' />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                        <ListItem button onClick={() => setLogoutDialogOpen(true)}>
                            <ListItemIcon className="icon">
                                <FaSignOutAlt color='white' />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>

            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    Are you sure you want to logout?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSignOut} color="error">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Logout Success */}
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success">
                    Logout successful!
                </Alert>
            </Snackbar>


            {/* Add content container to prevent content from being hidden behind the app bar */}
            <div className="content-container">
                <Typography variant="h4">.</Typography>
                {/* Your main content goes here */}
            </div>
        </div>
    );
};

export default SideNavigation;
