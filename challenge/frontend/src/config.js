const config = {
  api: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
    endpoints: {
      login: '/login/',
      complaints: {
        all: '/api/complaints/allComplaints/',
        open: '/api/complaints/openCases/',
        closed: '/api/complaints/closedCases/',
        top: '/api/complaints/topComplaints/',
      }
    }
  }
};

export default config; 