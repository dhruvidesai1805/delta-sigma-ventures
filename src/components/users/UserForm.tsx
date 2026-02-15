import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { userFormConfig, generateUserSchema } from '../../config/formConfig';
import { UserFormData } from '../../types/user';

const schema = generateUserSchema();

export const UserForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
    });

    useEffect(() => {
        if (isEditMode && id) {
            setLoading(true);
            userService.getById(id)
                .then(user => {
                    if (user) {
                        reset(user);
                    } else {
                        setSubmitError('User not found');
                    }
                })
                .catch(() => setSubmitError('Failed to fetch user details'))
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode, reset]);

    const onSubmit = async (data: UserFormData) => {
        setSubmitError(null);
        try {
            if (isEditMode && id) {
                await userService.update(id, data);
            } else {
                await userService.create(data);
            }
            navigate('/');
        } catch (error) {
            console.error(error);
            setSubmitError('Failed to save user. Please try again.');
        }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;

    return (
        <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h5" component="h2" gutterBottom>
                {isEditMode ? 'Edit User' : 'Create New User'}
            </Typography>

            {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {userFormConfig.map((field) => (
                    <Box key={field.name} mb={2}>
                        <Controller
                            name={field.name as keyof UserFormData}
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    type={field.type}
                                    value={value || ''}
                                    onChange={onChange}
                                    error={!!errors[field.name as keyof UserFormData]}
                                    helperText={errors[field.name as keyof UserFormData]?.message as string}
                                    required={field.required}
                                />
                            )}
                        />
                    </Box>
                ))}

                <Box display="flex" gap={2} mt={3}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                    >
                        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Update User' : 'Create User')}
                    </Button>
                    <Button
                        component={Link}
                        to="/"
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};
