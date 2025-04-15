import React from 'react';
import { Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const cardStyles = {
  padding: '20px',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center'
};

const ComplaintCard = ({ title, value, subtitle = null }) => {
  return (
    <Paper elevation={3} sx={cardStyles}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" data-testid="subtitle">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

ComplaintCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  subtitle: PropTypes.string
};

export default ComplaintCard; 