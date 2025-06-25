export interface CreateUser {
    email: string;
    firstName: string;
    lastName: string;
    urls?: object[];
    mimeType?: string;
}

export interface UpdateUser {
    email?: string;
    firstName?: string;
    lastName?: string;
    urls?: object[];
    mimeType?: string;
}
