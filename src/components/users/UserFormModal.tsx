import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Alert, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { userService } from '../../services/userService';
import { userFormConfig, generateUserSchema } from '../../config/formConfig';
import { UserFormData, User } from '../../types/user';

const schema = generateUserSchema();

interface UserFormModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userToEdit?: User | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({ open, onClose, onSuccess, userToEdit }) => {
    const isEditMode = Boolean(userToEdit);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormData>({
        resolver: zodResolver(schema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
    });

    useEffect(() => {
        if (open) {
            if (userToEdit) {
                reset(userToEdit);
            } else {
                reset({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                });
            }
            setSubmitError(null);
        }
    }, [open, userToEdit, reset]);

    const onSubmit = async (data: UserFormData) => {
        setSubmitError(null);
        try {
            if (isEditMode && userToEdit) {
                await userService.update(userToEdit.id, data);
                toast.success('User updated successfully');
            } else {
                await userService.create(data);
                toast.success('User created successfully');
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            const errorMessage = 'Failed to save user. Please try again.';
            setSubmitError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditMode ? 'Edit User' : 'Create New User'}</DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <DialogContent>
                    {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}

                    <Box display="flex" flexDirection="column" gap={2}>
                        {userFormConfig.map((field) => (
                            <Controller
                                key={field.name}
                                name={field.name as any}
                                control={control}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextField
                                        fullWidth
                                        label={field.label}
                                        type={field.type}
                                        value={value || ''}
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        error={!!errors[field.name as keyof UserFormData]}
                                        helperText={errors[field.name as keyof UserFormData]?.message as string}
                                        required={field.required}
                                        variant="outlined"
                                    />
                                )}
                            />
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
