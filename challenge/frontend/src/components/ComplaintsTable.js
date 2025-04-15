import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination
} from '@mui/material';

const columns = [
  { 
    id: 'account', 
    label: 'Lives In', 
    minWidth: 100,
    format: (value) => value ? value.replace(/[^0-9]/g, '') : 'N/A'
  },
  { 
    id: 'council_dist', 
    label: 'Made In', 
    minWidth: 100,
    format: (value) => value ? value.replace(/[^0-9]/g, '') : 'N/A'
  },
  { id: 'complaint_type', label: 'Type', minWidth: 120 },
  { id: 'descriptor', label: 'Descriptor', minWidth: 150 },
  { id: 'opendate', label: 'Open', minWidth: 100 },
  { id: 'closedate', label: 'Close', minWidth: 100 },
  { id: 'borough', label: 'Borough', minWidth: 100 },
  { id: 'city', label: 'City', minWidth: 100 },
  { id: 'community_board', label: 'Community Board', minWidth: 100 },
  { id: 'zip', label: 'Zip', minWidth: 80 }
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const ComplaintsTable = ({ complaints }) => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('opendate');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleRows = React.useMemo(
    () => stableSort(complaints, getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [complaints, order, orderBy, page, rowsPerPage]
  );

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ 
              backgroundColor: 'grey.100',
              '& .MuiTableCell-head': {
                color: 'text.primary',
                fontWeight: 'bold',
                fontSize: '0.875rem',
                borderBottom: '2px solid',
                borderColor: 'grey.300'
              },
              '& .MuiTableSortLabel-root': {
                color: 'text.primary',
                '&:hover': {
                  color: 'text.secondary'
                },
                '&.Mui-active': {
                  color: 'text.primary'
                }
              },
              '& .MuiTableSortLabel-icon': {
                color: 'text.primary !important'
              }
            }}>
              {columns.map((column) => (
                <TableCell
                  key={`header-${column.id}`}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleRequestSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((complaint) => (
              <TableRow 
                key={`row-${complaint.id || complaint.unique_key || Math.random()}`}
                hover
              >
                {columns.map((column) => (
                  <TableCell 
                    key={`cell-${complaint.id || complaint.unique_key || Math.random()}-${column.id}`}
                  >
                    {column.format ? column.format(complaint[column.id]) : complaint[column.id] || 'N/A'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={complaints.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

ComplaintsTable.propTypes = {
  complaints: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    unique_key: PropTypes.string,
    complaint_type: PropTypes.string,
    descriptor: PropTypes.string,
    opendate: PropTypes.string,
    closedate: PropTypes.string,
    borough: PropTypes.string,
    zip: PropTypes.string
  })).isRequired
};

export default ComplaintsTable; 