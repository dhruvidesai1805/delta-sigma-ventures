import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Button, Typography, Box, CircularProgress, Alert, Tooltip, Chip, Avatar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useUsers } from '../../hooks/useUsers';
import { UserFormModal } from './UserFormModal';
import { DeleteConfirmDialog } from '../common/DeleteConfirmDialog';
import { User } from '../../types/user';

function stringToColor(string: string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: 32,
            height: 32,
            fontSize: '0.875rem',
            mr: 1.5
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1]?.[0] || ''}`,
    };
}


export const UserList: React.FC = () => {
    const { users, loading, error, deleteUser, refetch } = useUsers();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCreate = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (userToDelete) {
            setIsDeleting(true);
            try {
                await deleteUser(userToDelete.id);
                toast.success('User deleted successfully');
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
            } catch (e) {
                console.error("Delete failed", e);
                toast.error('Failed to delete user');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (loading && users.length === 0) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <div>
            <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'start', sm: 'center' }}
                gap={{ xs: 2, sm: 0 }}
                mb={4}
            >
                <Box>
                    <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">Users</Typography>
                    <Typography variant="body1" color="text.secondary">Manage your team members and permissions.</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                    sx={{ px: 3, py: 1, width: { xs: '100%', sm: 'auto' } }}
                >
                    Add User
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    <Box display="flex" alignItems="center">
                                        <Avatar {...stringAvatar(`${user.firstName} ${user.lastName}`)} />
                                        <Typography variant="subtitle2" fontWeight={600}>{user.firstName} {user.lastName}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={user.phone} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleEdit(user)} size="small" sx={{ mr: 1, color: 'primary.main', bgcolor: 'primary.50', '&:hover': { bgcolor: 'primary.100' } }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <IconButton onClick={() => handleDeleteClick(user)} size="small" sx={{ color: 'error.main', bgcolor: 'error.50', '&:hover': { bgcolor: 'error.100' } }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {users.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <Typography variant="h6" color="text.secondary">No users found.</Typography>
                                    <Button variant="outlined" sx={{ mt: 2 }} onClick={handleCreate}>Create your first user</Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <UserFormModal
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={() => {
                    refetch();
                }}
                userToEdit={selectedUser}
            />

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={isDeleting}
            />
        </div>
    );
};
