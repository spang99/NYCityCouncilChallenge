import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, ListItemText, ListItemIcon } from '@mui/material';
import { Logout } from '@mui/icons-material';
import axios from 'axios';
import config from '../config';

const menuStyles = {
  transformOrigin: { horizontal: 'right', vertical: 'top' },
  anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
};

const avatarStyles = {
  width: 32,
  height: 32,
};

const userInfoStyles = {
  '& .MuiListItemText-primary': {
    color: 'text.primary',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  '& .MuiListItemText-secondary': {
    color: 'text.secondary',
    fontSize: '0.875rem',
  },
  '&.Mui-disabled': {
    opacity: 1,
  },
};

const NavBar = ({ children }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${config.api.baseURL}${config.api.endpoints.profile}`, {
          headers: { Authorization: `Token ${token}` }
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [token, navigate]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            New York City Council
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(anchorEl) ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Avatar sx={avatarStyles}>
                {userProfile?.first_name?.[0] || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              transformOrigin={menuStyles.transformOrigin}
              anchorOrigin={menuStyles.anchorOrigin}
            >
              {userProfile && (
                <>
                  <MenuItem disabled sx={userInfoStyles}>
                    <ListItemText 
                      primary={userProfile.full_name} 
                      secondary={`District ${userProfile.district}`}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

NavBar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NavBar; 