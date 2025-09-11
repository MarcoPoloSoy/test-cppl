export interface Patient {
    id: number | string | null;
    avatar?: string | null;
    name: string | null;
    lastName: string | null;
    phone: string | null;
    userRole?: string | null;
    userEmail?: string | null;
}