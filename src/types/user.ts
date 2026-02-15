export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

}

export type UserFormData = Omit<User, 'id'>;

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
