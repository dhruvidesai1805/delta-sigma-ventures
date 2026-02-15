import React from 'react';
import { Dialog, DialogContent, Typography, Box, Button, Fade, Backdrop } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface DeleteConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ open, onClose, onConfirm, loading }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: { backgroundColor: 'rgba(0, 0, 0, 0.2)' }
                }
            }}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    padding: 2,
                    maxWidth: 400,
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0px 10px 40px rgba(0,0,0,0.1)'
                }
            }}
        >
            <Fade in={open}>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            backgroundColor: '#fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1,
                            boxShadow: '0 0 0 4px #fef2f2'
                        }}
                    >
                        <ErrorOutlineIcon sx={{ color: '#ef4444', fontSize: 24 }} />
                    </Box>

                    <Typography variant="h6" component="h2" fontWeight="bold" sx={{ color: '#1f2937' }}>
                        Delete User
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260, mb: 3 }}>
                        Are you sure you want to delete this user? This action cannot be undone.
                    </Typography>

                    <Box display="flex" gap={2} width="100%">
                        <Button
                            onClick={onClose}
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: '#f3f4f6',
                                color: '#374151',
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#e5e7eb', boxShadow: 'none' }
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            fullWidth
                            variant="contained"
                            color="error"
                            disabled={loading}
                            sx={{ boxShadow: 'none', '&:hover': { boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)' } }}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </Box>
                </DialogContent>
            </Fade>
        </Dialog>
    );
};
