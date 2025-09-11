export interface Doctor {
    id: number | string | null;
    avatar?: string | null;
    name: string | null;
    lastName: string | null;
    specialty: string | null;
    phone: string | null;
    userRole?: string | null;
    userEmail?: string | null;
}