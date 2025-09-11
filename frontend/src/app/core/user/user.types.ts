export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    relation?: object;
    avatar?: string;
    status?: string;
}
