import { z } from 'zod';

export type FieldType = 'text' | 'email' | 'tel' | 'number' | 'date';

export interface FormFieldConfig {
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    validation?: z.ZodTypeAny;
    required?: boolean;
}

export const userFormConfig: FormFieldConfig[] = [
    {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        validation: z.string().min(2, 'First name must be at least 2 characters'),
    },
    {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        validation: z.string().min(2, 'Last name must be at least 2 characters'),
    },
    {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        validation: z.string().email('Invalid email address'),
    },
    {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        validation: z.string().regex(/^\d{10}$/, 'Phone number must be a valid 10-digit number'),
    },
];

// Dynamic Schema Generation based on config
export const generateUserSchema = () => {
    const shape: any = {};
    userFormConfig.forEach((field) => {
        if (field.validation) {
            shape[field.name] = field.validation;
        } else if (field.required) {
            shape[field.name] = z.string().min(1, `${field.label} is required`);
        } else {
            shape[field.name] = z.string().optional();
        }
    });
    return z.object(shape);
};
