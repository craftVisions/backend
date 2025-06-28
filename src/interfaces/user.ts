export interface User {
    userId: string; 
    credentialId: string; 
    email: string;
    isEmailVerified?: boolean;
}