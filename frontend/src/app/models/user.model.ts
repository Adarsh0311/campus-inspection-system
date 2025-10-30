export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
}

export interface CreateUserPayload extends Omit<User, 'id' | 'createdAt' | 'lastLogin'> {
    password: string;
}

