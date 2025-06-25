export interface CreateUser {
    email: string;
    firstName: string;
    lastName?: string;
    urls?: object[];
    mimeType?: string;
    credentialId: string;
}

export interface UpdateUser {
    email?: string;
    firstName?: string;
    lastName?: string;
    urls?: object[];
    mimeType?: string;
}
