export enum AppointmentStatusEnum {
    scheduled = 'scheduled',
    pending = 'pending',
    cancelled = 'cancelled',
    completed = 'completed'
}

export interface Appointment {
    id: number | null;
    patientId: number | null;
    doctorId: number | null;
    patientName?: string;
    patientLastName?: string;
    doctorName?: string;
    doctorLastName?: string;
    startAt: Date | null;
    endAt: Date | null;
    reason?: string;
    status: AppointmentStatusEnum;
}

export interface AppointmentHoursArray {
    key: string,
    hour: number,
    formatted: string,
    available: boolean
}

export interface AppointmentHours {
    first: number,
    last: number,
    hoursInAdvance: number,
    selectedHour: number | null,
    hours: AppointmentHoursArray[]
}

export interface AppointmentStatus {
    [key: string]: {
        icon: string,
        class: string,
        classMenu: string
    }
}
