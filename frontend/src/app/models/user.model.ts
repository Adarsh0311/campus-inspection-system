export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    lastLogin?: string;
    updatedAt: string;
}

export interface CreateUserPayload extends Omit<User, 'id' | 'createdAt' | 'lastLogin'> {
    password: string;
}

export interface UpdateUserPayload extends Omit<User, 'createdAt' | 'lastLogin'> {
    password: string;
}


