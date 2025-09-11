import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Appointment, AppointmentStatusEnum } from 'app/modules/admin/dashboards/appointments/appointments.types';
import { Doctor } from '../../catalogs/doctors/doctors.types';
import { map as arrayMap, isArray, camelCase, snakeCase, mapKeys } from 'lodash-es';
import { Patient } from '../../catalogs/patients/patients.types';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


@Injectable({ providedIn: 'root' })
export class AppointmentService {
    // Private
    private _dashboardInfo: BehaviorSubject<any> = new BehaviorSubject(null);
    private _appointment: BehaviorSubject<Appointment | null> = new BehaviorSubject(null);
    private _appointments: BehaviorSubject<Appointment[] | null> = new BehaviorSubject(null);
    private _today_appointments: BehaviorSubject<Appointment[] | null> = new BehaviorSubject(null);
    private _tomorrow_appointments: BehaviorSubject<Appointment[] | null> = new BehaviorSubject(null);
    private _next_appointments: BehaviorSubject<Appointment[] | null> = new BehaviorSubject(null);
    private _doctors: BehaviorSubject<Doctor[] | null> = new BehaviorSubject(null);
    private _patients: BehaviorSubject<any[] | null> = new BehaviorSubject(null);
    // SnackBar
    private _snackBar = inject(MatSnackBar);
    private _openSnackBar(message: string,
        duration: number = 5000,
        appearance: 'fill' | 'outline' | 'soft' = 'fill',
        type: 'info' | 'success' | 'error' = 'info'): void {

        const config: MatSnackBarConfig = {
            duration: duration,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: [`snackbar-type-${appearance}-${type}`]
        };

        this._snackBar.open(message, '', config);
    }
    // Convert to camelCase for Appointments interface
    private _toCamelCaseAppointmentProperties = <T>(obj: any): T => {

        if (!isArray(obj)) {
            return mapKeys(obj, (value, key) => camelCase(key)) as T;
        }
        if (isArray(obj)) {
            return arrayMap(obj, (item) => mapKeys(item, (value, key) => camelCase(key)) as Appointment) as T;
        }
    };
    // Convert to camelCase for Doctors interface
    private _toCamelCaseDoctorProperties = <T>(obj: any): T => {

        if (!isArray(obj)) {
            return mapKeys(obj, (value, key) => camelCase(key)) as T;
        }
        if (isArray(obj)) {
            return arrayMap(obj, (item) => mapKeys(item, (value, key) => camelCase(key)) as Doctor) as T;
        }
    };
    // Convert to camelCase for Patients interface
    private _toCamelCasePatientProperties = <T>(obj: any): T => {

        if (!isArray(obj)) {
            return mapKeys(obj, (value, key) => camelCase(key)) as T;
        }
        if (isArray(obj)) {
            return arrayMap(obj, (item) => mapKeys(item, (value, key) => camelCase(key)) as Patient) as T;
        }
    };
    // Convert to snake_case
    private _toSnakeCaseProperties = <T>(obj: any): T => {

        if (!isArray(obj)) {
            return mapKeys(obj, (value, key) => snakeCase(key)) as T;
        }
        if (isArray(obj)) {
            return arrayMap(obj, (item) => mapKeys(item, (value, key) => snakeCase(key))) as T;
        }
    };



    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for dashboardInfo
     */
    get dashboardInfo$(): Observable<any> {
        return this._dashboardInfo.asObservable();
    }

    /**
     * Getter for todayAppointments
     */
    get todayAppointments$(): Observable<any> {
        return this._today_appointments.asObservable();
    }

    /**
     * Getter for todayAppointments
     */
    get tomorrowAppointments$(): Observable<any> {
        return this._tomorrow_appointments.asObservable();
    }

    /**
     * Getter for appointments
     */
    get appointments$(): Observable<any> {
        return this._appointments.asObservable();
    }

    /**
     * Getter for appointment
     */
    get appointment$(): Observable<any> {
        return this._appointment.asObservable();
    }

    /**
     * Getter for doctors
     */
    get doctors$(): Observable<any> {
        return this._doctors.asObservable();
    }

    /**
     * Getter for patients
     */
    get patients$(): Observable<any> {
        return this._patients.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get dashboardInfo
     */
    getData(): Observable<any> {

        return this._httpClient.get('api/appointments/dashboard').pipe(
            tap((response: any) => {

                // Pass keys from snake_case to camelCase
                const today_appointments = this._toCamelCaseAppointmentProperties<Appointment[]>(response.appointments.today);
                const tomorrow_appointments = this._toCamelCaseAppointmentProperties<Appointment[]>(response.appointments.tomorrow);
                const next_appointments = this._toCamelCaseAppointmentProperties<Appointment[]>(response.appointments.next);
                const doctors = this._toCamelCaseDoctorProperties<Doctor[]>(response.doctors);
                const patients = this._toCamelCasePatientProperties<Patient[]>(response.patients);

                // Update response before save in dashboardInfo
                response.appointments.today = today_appointments;
                response.appointments.tomorrow = tomorrow_appointments;
                response.appointments.next = next_appointments;
                response.doctors = doctors;
                response.patients = patients;

                // Set update observers
                this._dashboardInfo.next(response);
                this._today_appointments.next(today_appointments);
                this._tomorrow_appointments.next(tomorrow_appointments);
                this._next_appointments.next(next_appointments);
                this._doctors.next(doctors);
                this._patients.next(patients);
                this._appointments.next([...today_appointments, ...tomorrow_appointments, ...next_appointments]);

            }),
            catchError(this.catchErrorFn)
        );
    }

    /**
     * Get appointment by id
     * 
     * @param id
     */
    getAppointmentById(id: number | string): Observable<any> {

        if (id == 'new') {
            const newAppointment = {
                id: null,
                doctorId: null,
                patientId: null,
                startAt: null,
                endAt: null,
                status: AppointmentStatusEnum.pending
            }
            this._appointment.next(newAppointment);
            return of(newAppointment);
        }

        return this._appointments.pipe(
            take(1),
            map((appointments) => {

                // Find the appointment
                const appointment = appointments.find((item) => item.id === id) || null;

                // Update the appointment
                this._appointment.next(appointment);

                // Return the appointment
                return appointment;
            }),
            switchMap((appointment) => {
                if (!appointment) {

                    // TODO: Verify deprecation
                    return throwError(
                        'Could not found appointment with id of ' + id + '!'
                    );
                }
                return of(appointment);
            }),
            catchError(this.catchErrorFn)
        );
    }

    /**
     * Delete the appointment
     *
     * @param id
     */
    deleteAppointment(id: number): Observable<boolean> {

        return this.appointments$.pipe(
            take(1),
            switchMap((appointments) =>
                this._httpClient
                    .delete(`api/appointments/${id}`)
                    .pipe(
                        map((response: object) => {

                            // Find the index of the deleted appointment
                            const index = appointments.findIndex(
                                (item) => item.id === id
                            );
                            // Delete the appointment
                            appointments.splice(index, 1);
                            // Update the appointments
                            this._appointments.next(appointments);
                            // Snackbar success message
                            this._openSnackBar('Appointment deleted.', 5000, 'fill', 'info');

                            // Return the deleted status
                            return true;
                        })
                    )
            ),
            catchError(this.catchErrorBooleanFn)
        );
    }

    /**
     * Update appointment
     *
     * @param id
     * @param appointment
     */
    updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {

        return this.appointments$.pipe(
            take(1),
            switchMap((appointments) => {
                const data = this._toSnakeCaseProperties(appointment) as object;
                return this._httpClient
                    .patch<Appointment>(`api/appointments/${id}`, {
                        appointment: data,
                    })
                    .pipe(
                        map((updatedAppointment) => {

                            updatedAppointment = this._toCamelCaseAppointmentProperties<Appointment>(updatedAppointment);

                            // Snackbar success message
                            this._openSnackBar('Appointment updated.', 5000, 'fill', 'success');

                            // Return the updated appointment
                            return updatedAppointment;
                        }),
                        switchMap((updatedAppointment) =>
                            this.appointment$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the appointment if it's selected
                                    this._appointment.next(updatedAppointment);

                                    // Return the updated appointment

                                    return updatedAppointment;
                                })
                            )
                        )
                    )
            }),
            catchError(this.catchErrorFn)
        );
    }

    /**
     * Create appointment
     *
     * @param appointment
     */
    createAppointment(appointment: Appointment): Observable<object> {

        appointment = this._toSnakeCaseProperties(appointment) as Appointment;

        return this.appointments$.pipe(
            take(1),
            switchMap((appointments) =>
                this._httpClient
                    .post('api/appointments', appointment)
                    .pipe(
                        map((data) => {

                            appointment.id = data['appointmentId'];
                            appointment = this._toCamelCaseAppointmentProperties(appointment);
                            appointments.push(appointment);
                            this._appointments.next(appointments);
                            this._appointment.next(appointment);
                            this._openSnackBar('New appointment added.', 5000, 'fill', 'success');
                            return appointment;
                        })
                    )
            ),
            catchError(this.catchErrorFn)
        );
    }

    /**
     * TODO: Get appontments by doctor id
     *
     * @param id
     */
    getDoctorByAppointmentId(id: number) { }

    /**
     * Handle http error response
     *
     * @param index
     * @param item
     */
    catchErrorFn(errorObj: HttpErrorResponse): Observable<{
        error: boolean;
        errorObj: HttpErrorResponse;
    }> {

        // Example of handle specific HTTP error codes or general API errors
        // if (errorObj.status === 401) {
        //     // Handle unauthorized access
        // } else if (errorObj.status === 404) {
        //     // Handle Not Found errors
        // }
        // else {
        //     // Handle other HTTP errors
        //     console.error(errorObj.message);
        //     this._openSnackBar(errorObj.error.message, 5000, 'fill', 'error');
        // }
        // console.error('HTTP Interceptor caught error:', error);
        this._openSnackBar(errorObj.error.message, 5000, 'fill', 'error');
        console.error(errorObj.message);

        return of({ error: true, errorObj });
    }

    /**
     * Handle http error response return boolean
     *
     * @param index
     * @param item
     */
    catchErrorBooleanFn(errorObj: HttpErrorResponse): Observable<boolean> {

        this._openSnackBar(errorObj.error.message, 5000, 'fill', 'error');
        console.error(errorObj.message);

        return of(false);
    }
}
