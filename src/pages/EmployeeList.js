import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  Box,
  MenuItem,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  CircularProgress, Alert, Snackbar
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import { getDocs, collection, addDoc, query, where, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import SideNavigation from "../components/UI/SideNavigation";
import ClearFiltersButton from '../components/UI/ClearFiltersButton';
import { debounce } from 'lodash';


const theme = createTheme();

const RootContainer = styled('div')({
  padding: (theme) => theme.spacing(2),
});

const CreateButton = styled(Button)({
  marginBottom: (theme) => theme.spacing(2),
});

const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
});




const EmployeeCard = ({ employee, onClose }) => {
  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle variant="h6" style={{ textAlign: 'center', marginBottom: theme.spacing(2) }}>
        Employee Details
      </DialogTitle>
      <DialogContent>
        <FormContainer>
          <List>
            <ListItem>
              <ListItemText
                primary={<Typography variant="subtitle1">Name</Typography>}
                secondary={`${employee.name} ${employee.surname}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<Typography variant="subtitle1">Email</Typography>}
                secondary={employee.email}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<Typography variant="subtitle1">Employee Number</Typography>}
                secondary={employee.employeeNumber}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<Typography variant="subtitle1">Salary</Typography>}
                secondary={employee.salary}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<Typography variant="subtitle1">Role</Typography>}
                secondary={employee.role}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<Typography variant="subtitle1">Reporting Manager</Typography>}
                secondary={employee.manager}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={<Typography variant="subtitle1">Birth Date</Typography>}
                secondary={employee.birthDate}
              />
            </ListItem>
          </List>
        </FormContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};


const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    birthDate: '',
    employeeNumber: '',
    salary: '',
    role: '',
    manager: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [clearFilters, setClearFilters] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editableEmployee, setEditableEmployee] = useState(null);



  const handleViewEmployee = (employee) => {
    setSelectedEmployees([employee]);
  };

  const handleViewEmployeeClose = () => {
    setSelectedEmployees([]);
  };


  useEffect(() => {
    fetchEmployees();
  }, [searchQuery, filterRole, sortColumn, sortDirection, clearFilters]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const employeesCollection = collection(firestore, 'employees');
      let employeesQuery = query(employeesCollection);

      if (searchQuery) {
        employeesQuery = query(employeesCollection, where('name', '==', searchQuery));
      }
      

      if (filterRole) {
        employeesQuery = query(employeesCollection, where('role', '==', filterRole));
      }

      if (sortColumn) {
        employeesQuery = query(employeesCollection, orderBy(sortColumn, sortDirection));
      }

      const employeesSnapshot = await getDocs(employeesQuery);
      const employeeData = employeesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeeData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching employees:', error);
    }
  };

  const handleClearFilters = () => {
    setClearFilters(!clearFilters);
    setSearchQuery('');
    setFilterRole('');
    setSortColumn('');
    setSortDirection('asc');
  };

  const clearForm = () => {
    setFormData({
      name: '',
      surname: '',
      email: '',
      birthDate: '',
      employeeNumber: '',
      salary: '',
      role: '',
      manager: '',
    });
  };
  
  const handleEdit = (employee) => {
    setEditableEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleEditEmployee = async () => {
    try {
      setLoading(true);
  
      await updateDoc(doc(firestore, 'employees', editableEmployee.id), {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        birthDate: formData.birthDate,
        employeeNumber: formData.employeeNumber,
        salary: formData.salary,
        role: formData.role,
        manager: formData.manager,
      });
  
      fetchEmployees();
  
      setSnackbarMessage('Employee updated successfully');
      setSnackbarOpen(true);
      clearForm();
  
    } catch (error) {
      console.error('Error updating employee:', error);
    } finally {
      // Close the edit dialog
      setEditDialogOpen(false);
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  useEffect(() => {
    if (editableEmployee) {
      setFormData({
        name: editableEmployee.name || '',
        surname: editableEmployee.surname || '',
        email: editableEmployee.email || '',
        birthDate: editableEmployee.birthDate || '',
        employeeNumber: editableEmployee.employeeNumber || '',
        salary: editableEmployee.salary || '',
        role: editableEmployee.role || '',
        manager: editableEmployee.manager || '',
      });
    }
  }, [editableEmployee]);
  

  const handleDelete = async (id) => {
    setEmployeeToDelete(id);
    setConfirmDialogOpen(true);
  };


  const confirmDelete = async () => {
    try {
      setLoading(true);

      await deleteDoc(doc(firestore, 'employees', employeeToDelete));

      fetchEmployees();

      console.log(`Employee with ID ${employeeToDelete} deleted successfully`);

      setSnackbarMessage('Employee deleted successfully');
      setSnackbarOpen(true);

    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      setConfirmDialogOpen(false);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCreateEmployee = async () => {
    try {

      setLoading(true);

      const newEmployee = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        birthDate: formData.birthDate,
        employeeNumber: formData.employeeNumber,
        salary: formData.salary,
        role: formData.role,
        manager: formData.manager,
      };

      const employeeRef = await addDoc(collection(firestore, 'employees'), newEmployee);

      setLoading(false);
      setOpenDialog(false);
      clearForm();

      console.log('Employee created with ID:', employeeRef.id);

      console.log('Employee created successfully');
      setSnackbarMessage('Employee created successfully');
      setSnackbarOpen(true);

      fetchEmployees();
    } catch (error) {
      console.error('Error creating employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportingLineManagerOptions = employees.map((employee) => ({
    value: employee.id,
    label: `${employee.name} ${employee.surname}`,
  }));

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleNameChange = useCallback((e) => handleInputChange('name', e.target.value), []);
  const handleSurnameChange = useCallback((e) => handleInputChange('surname', e.target.value), []);
  const handleEmailChange = useCallback((e) => handleInputChange('email', e.target.value), []);
  const handleBirthDateChange = useCallback((e) => handleInputChange('birthDate', e.target.value), []);
  const handleEmployeeNumberChange = useCallback((e) => handleInputChange('employeeNumber', e.target.value), []);
  const handleSalaryChange = useCallback((e) => handleInputChange('salary', e.target.value), []);
  const handleRoleChange = useCallback((e) => handleInputChange('role', e.target.value), []);
  const handleManagerChange = useCallback((e) => handleInputChange('manager', e.target.value), []);

  const handleSearch = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleFilterRole = useCallback((e) => setFilterRole(e.target.value), []);
  const handleSortColumn = useCallback((column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  const handleCancel = () => {
    setEditDialogOpen(false);
    clearForm();
  };


  return (
    <>
      <SideNavigation />
      <RootContainer>
        <Card className="welcome-card">
          <Box p={1}>
            <Typography variant="h4" textAlign="center">
              Employee Portal
            </Typography>
            {/* <Typography textAlign="center" mt={2}>
              Employee List
            </Typography> */}
            <CreateButton variant="contained" color="primary" onClick={handleCreate}>
              Create Employee
            </CreateButton>

          </Box>
        </Card>


        <Box mt={2} display="flex" justifyContent="space-between">
        <TextField label="Search" variant="outlined" size="small" onChange={handleSearch} />
        <TextField label="Filter by Role" variant="outlined" size="small" value={filterRole} onChange={handleFilterRole} />
      
        <Button onClick={() => handleSortColumn('name')}>
          Sort by Name {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
        </Button>
        <Button onClick={() => handleSortColumn('role')}>
          Sort by Role {sortColumn === 'role' && (sortDirection === 'asc' ? '▲' : '▼')}
        </Button>
        <ClearFiltersButton onClick={handleClearFilters}>
          Clear Filters
        </ClearFiltersButton>
      </Box>

        {loading ? (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{`${employee.name} ${employee.surname}`}</TableCell>
                      <TableCell>{employee.role}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>
                      
                        <Button onClick={() => handleViewEmployee(employee)}>View</Button>
                        <Button onClick={() => handleEdit(employee)}>Edit</Button>
                        <Button onClick={() => handleDelete(employee.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {selectedEmployees.length === 1 && (
              <EmployeeCard employee={selectedEmployees[0]} onClose={handleViewEmployeeClose} />
            )}
          </>
        )}

        

        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle variant="h6" style={{ textAlign: 'center', marginBottom: theme.spacing(2) }}>
            Create Employee
          </DialogTitle>
          <DialogContent>
            <FormContainer>
              <TextField label="Name" fullWidth value={formData.name} onChange={handleNameChange} />
              <TextField label="Surname" fullWidth value={formData.surname} onChange={handleSurnameChange} />
              <TextField label="Email" fullWidth value={formData.email} onChange={handleEmailChange} />
              <TextField label="Birth Date" fullWidth type="date" value={formData.birthDate} onChange={handleBirthDateChange} />
              <TextField label="Employee Number" fullWidth value={formData.employeeNumber} onChange={handleEmployeeNumberChange} />
              <TextField label="Salary" fullWidth value={formData.salary} onChange={handleSalaryChange} />
              <TextField label="Role/Position" fullWidth value={formData.role} onChange={handleRoleChange} />
              <TextField
                select
                label="Reporting Line Manager"
                fullWidth
                value={formData.manager}
                onChange={handleManagerChange}
                SelectProps={{
                  native: false,
                }}
              >
                <MenuItem value="" disabled>
                  Select Line Manager
                </MenuItem>
                {reportingLineManagerOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button color="primary" onClick={handleCreateEmployee} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this employee?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {editableEmployee && (
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle variant="h6" style={{ textAlign: 'center', marginBottom: theme.spacing(2) }}>
            Edit Employee
          </DialogTitle>
          <DialogContent>
            <FormContainer>
              <TextField label="Name" fullWidth value={formData.name} onChange={handleNameChange} />
              <TextField label="Surname" fullWidth value={formData.surname} onChange={handleSurnameChange} />
              <TextField label="Email" fullWidth value={formData.email} onChange={handleEmailChange} />
              <TextField label="Birth Date" fullWidth type="date" value={formData.birthDate} onChange={handleBirthDateChange} />
              <TextField label="Employee Number" fullWidth value={formData.employeeNumber} onChange={handleEmployeeNumberChange} />
              <TextField label="Salary" fullWidth value={formData.salary} onChange={handleSalaryChange} />
              <TextField label="Role/Position" fullWidth value={formData.role} onChange={handleRoleChange} />
              <TextField
                select
                label="Reporting Line Manager"
                fullWidth
                value={formData.manager}
                onChange={handleManagerChange}
                SelectProps={{
                  native: false,
                }}
              >
                <MenuItem value="" disabled>
                  Select Line Manager
                </MenuItem>
                {reportingLineManagerOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleCancel()}>Cancel</Button>
            <Button color="primary" onClick={handleEditEmployee} disabled={loading}>
              {loading ? <CircularProgress size={20} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{
              width: '100%',
              backgroundColor: '#4CAF50',
              color: '#ffffff',  
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </RootContainer>


    </>
  );
};

export default EmployeeList;
