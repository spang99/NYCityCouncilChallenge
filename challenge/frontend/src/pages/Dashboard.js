import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';
import config from '../config';
import ComplaintCard from '../components/ComplaintCard';
import ComplaintsTable from '../components/ComplaintsTable';

const Dashboard = () => {
  const [stats, setStats] = useState({
    openCases: 0,
    closedCases: 0,
    topComplaints: [],
    allComplaints: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [complaintTypeFilter, setComplaintTypeFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Token ${token}` };

        const [openCases, closedCases, topComplaints, allComplaints] = await Promise.all([
          axios.get(`${config.api.baseURL}${config.api.endpoints.complaints.open}`, { headers }),
          axios.get(`${config.api.baseURL}${config.api.endpoints.complaints.closed}`, { headers }),
          axios.get(`${config.api.baseURL}${config.api.endpoints.complaints.top}`, { headers }),
          axios.get(`${config.api.baseURL}${config.api.endpoints.complaints.all}`, { headers })
        ]);

        setStats({
          openCases: openCases.data.length,
          closedCases: closedCases.data.length,
          topComplaints: topComplaints.data,
          allComplaints: allComplaints.data
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const complaintTypes = stats.allComplaints 
    ? [...new Set(stats.allComplaints.map(complaint => complaint.complaint_type || '').filter(Boolean))].sort()
    : [];

  const filteredComplaints = React.useMemo(() => {
    if (!stats.allComplaints) return [];
    return stats.allComplaints.filter(complaint => 
      !complaintTypeFilter || complaint.complaint_type === complaintTypeFilter
    );
  }, [stats.allComplaints, complaintTypeFilter]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        NYCC Complaints Dashboard
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <ComplaintCard 
            title="Open Cases"
            value={stats.openCases}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <ComplaintCard 
            title="Closed Cases"
            value={stats.closedCases}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <ComplaintCard 
            title="Top Complaint"
            value={stats.topComplaints[0]?.complaint_type || 'N/A'}
            subtitle={`${stats.topComplaints[0]?.count || 0} cases`}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Complaints</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="complaint-type-filter-label">Filter by Type</InputLabel>
          <Select
            labelId="complaint-type-filter-label"
            value={complaintTypeFilter}
            label="Filter by Type"
            onChange={(e) => setComplaintTypeFilter(e.target.value)}
          >
            <MenuItem value="">All Complaints</MenuItem>
            {complaintTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <ComplaintsTable complaints={filteredComplaints} />
    </Container>
  );
};

export default Dashboard; 