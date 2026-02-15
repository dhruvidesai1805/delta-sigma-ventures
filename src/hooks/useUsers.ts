import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/user';
import { userService } from '../services/userService';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await userService.getAll();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const deleteUser = async (id: string) => {
        try {
            await userService.delete(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            setError('Failed to delete user');
            console.error(err);
            throw err;
        }
    };

    return { users, loading, error, refetch: fetchUsers, deleteUser };
};
