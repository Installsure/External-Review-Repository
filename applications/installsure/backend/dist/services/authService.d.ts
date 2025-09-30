export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    companyId?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserData {
    email: string;
    password: string;
    name: string;
    role?: string;
    companyId?: number;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface AuthResult {
    user: Omit<User, 'password'>;
    token: string;
    expiresIn: string;
}
export declare class AuthService {
    register(data: CreateUserData, requestId?: string): Promise<AuthResult>;
    login(credentials: LoginCredentials, requestId?: string): Promise<AuthResult>;
    verifyToken(token: string, requestId?: string): Promise<Omit<User, 'password'>>;
    refreshToken(token: string, requestId?: string): Promise<AuthResult>;
    changePassword(userId: number, currentPassword: string, newPassword: string, requestId?: string): Promise<void>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map