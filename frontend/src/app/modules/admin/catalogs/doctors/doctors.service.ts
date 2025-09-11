import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Doctor } from 'app/modules/admin/catalogs/doctors/doctors.types';
import { map as arrayMap, camelCase, isArray, mapKeys, snakeCase } from 'lodash-es';
import { BehaviorSubject, Observable, catchError, filter, map, of, switchMap, take, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DoctorsService {
    // Private
    private _doctor: BehaviorSubject<Doctor | null> = new BehaviorSubject(null);
    private _doctors: BehaviorSubject<Doctor[] | null> = new BehaviorSubject(null);
    private _doctorsClone: BehaviorSubject<Doctor[] | null> = new BehaviorSubject(null);
    // Convert to camelCase for Doctors interface
    private _toCamelCaseProperties = <T>(obj: any): T => {
        if (!isArray(obj)) {
            return mapKeys(obj, (value, key) => camelCase(key)) as T;
        }
        if (isArray(obj)) {
            return arrayMap(obj, (item) => mapKeys(item, (value, key) => camelCase(key)) as Doctor) as T;
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

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for doctor
     */
    get doctor$(): Observable<Doctor> {
        return this._doctor.asObservable();
    }

    /**
     * Getter for doctors
     */
    get doctors$(): Observable<Doctor[]> {
        return this._doctors.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get doctors
     */
    getDoctors(): Observable<Doctor[]> {
        return this._httpClient.get<Doctor[]>('api/doctors').pipe(
            tap((doctors) => {
                doctors = this._toCamelCaseProperties(doctors);
                this._doctors.next(doctors);
                this._doctorsClone.next(doctors);
            })
        );
    }

    /**
     * Search doctors with given query
     *
     * @param query
     */
    searchDoctors(query: string): Observable<Doctor[]> {
        if (query.length < 3) {
            // return this._doctorsClone;
            this._doctors.next(this._doctorsClone.value);
            return this._doctors;
        }
        return this._httpClient
            .get<Doctor[]>('api/doctors/search', {
                params: { q: query },
            })
            .pipe(
                tap((doctors) => {
                    doctors = this._toCamelCaseProperties(doctors);
                    this._doctors.next(doctors);
                })
            );
    }

    /**
     * Get doctor by id
     * 
     * @param id
     */
    getDoctorById(id: number | string): Observable<Doctor> {

        // New doctor
        if (id == 'new') {
            const newDoctor = {
                id: null,
                name: null,
                lastName: null,
                userEmail: null,
                phone: null,
                specialty: null,
            }
            this._doctor.next(newDoctor);
            return of(newDoctor);
        }

        // If doctor exist
        return this._doctors.pipe(
            take(1),
            map((doctors) => {

                // Find the doctor
                const doctor = doctors.find((item) => item.id === id) || null;

                // Update the doctor
                this._doctor.next(doctor);

                // Return the doctor
                return doctor;
            }),
            switchMap((doctor) => {
                if (!doctor) {
                    // TODO: Verify deprecation
                    return throwError(
                        'Could not found doctor with id of ' + id + '!'
                    );
                }

                return of(doctor);
            })
        );
    }

    /**
     * Create doctor
     * 
     * @param doctor
     */
    createDoctor(doctor: Doctor): Observable<any> {
        doctor = this._toSnakeCaseProperties(doctor);
        return this.doctors$.pipe(
            take(1),
            switchMap((doctors) =>
                this._httpClient
                    .post<Doctor>('api/doctors', doctor)
                    .pipe(
                        map((newDoctor) => {
                            // newDoctor = this._toCamelCaseProperties(newDoctor);
                            // Update the doctors with the new doctor
                            console.log('newDoctor', newDoctor);
                            doctor.id = newDoctor['doctorId'];
                            doctor = this._toCamelCaseProperties(doctor);
                            this._doctors.next([doctor, ...doctors]);
                            // Update doctor
                            this._doctor.next(doctor);

                            // console.log( 'newDoctor', newDoctor );



                            // Return the new doctor
                            return newDoctor;
                        })
                    )
            ),
            catchError((errorObj) => this.catchErrorFn(errorObj, this))
        );
    }

    /**
     * Update doctor
     *
     * @param id
     * @param doctor
     */
    updateDoctor(id: number, doctor: Doctor): Observable<any> {

        return this.doctors$
            .pipe(
                take(1),
                switchMap((doctors) => {
                    const data = this._toSnakeCaseProperties(doctor) as object;
                    return this._httpClient
                        .patch<Doctor>(`api/doctors/${id}`, {
                            doctor: data,
                        })
                        .pipe(
                            map((updatedDoctor) => {

                                updatedDoctor = this._toCamelCaseProperties<Doctor>(updatedDoctor);

                                this._openSnackBar('Doctor updated.', 5000, 'fill', 'success');

                                // Find the index of the updated doctor
                                const index = doctors.findIndex(
                                    (item) => item.id === id
                                );

                                // Update the doctor
                                doctors[index] = updatedDoctor;

                                // Update the doctors
                                this._doctors.next(doctors);

                                this._doctor.next(updatedDoctor);

                                // Snackbar
                                this._openSnackBar('Doctor updated.', 5000, 'fill', 'success');

                                // Return the updated doctor
                                return updatedDoctor;
                            }),
                            switchMap((updatedDoctor) =>
                                this.doctor$.pipe(
                                    take(1),
                                    filter((item) => item && item.id === id),
                                    tap(() => {
                                        // Update the doctor if it's selected
                                        this._doctor.next(updatedDoctor);

                                        // Return the updated doctor
                                        return updatedDoctor;
                                    })
                                )
                            )
                        )
                }),
                catchError((errorObj) => this.catchErrorFn(errorObj, this))
            );
    }

    /**
     * Delete the doctor
     *
     * @param id
     */
    deleteDoctor(id: number | string): Observable<boolean> {
        return this.doctors$.pipe(
            take(1),
            switchMap((doctors) =>
                this._httpClient
                    .delete(`api/doctors/${id}`)
                    .pipe(
                        map((resp: any) => {
                            // Find the index of the deleted doctor
                            const index = doctors.findIndex(
                                (item) => item.id === id
                            );

                            if (resp && resp.deleted) {
                                this._openSnackBar(resp.message, 5000, 'fill', 'info');
                            }
                            else {
                                this._openSnackBar('Unknown error.', 5000, 'fill', 'error');
                                console.error('Unknown error.', resp);
                            }

                            // Delete the doctor
                            doctors.splice(index, 1);

                            // Update the doctors
                            this._doctors.next(doctors);

                            // Return the deleted status
                            return true;
                        })
                    )
            ),
            catchError((errorObj) => this.catchErrorFn(errorObj, this))
        );
    }

    /**
     * Handle http error response return
     *
     * @param errorObj
     * @param parentContext
     */
    catchErrorFn(errorObj: HttpErrorResponse, parentContext: any): Observable<boolean> {

        let errorMessage = errorObj.error.message;

        // Handle mysql errors 
        if (typeof errorObj.error.error !== 'undefined' && typeof errorObj.error.error.sqlState !== 'undefined') {
            switch (errorObj.error.error.errno) {
                case 1451:
                    errorMessage += '. ' + 'Cannot delete or update a parent row';
                    break;
                case 1045:
                    errorMessage += '. ' + 'Access denied for user';
                    break;
                case 1040:
                    errorMessage += '. ' + 'Too many connections';
                    break;
                case 1064:
                    errorMessage += '. ' + 'You have an error in your SQL syntax';
                    break;
                case 1114:
                    errorMessage += '. ' + 'The table is full';
                    break;
                case 2006:
                    errorMessage += '. ' + 'MySQL server has gone away';
                    break;
                case 1452:
                    errorMessage += '. ' + 'Cannot add or update a child row';
                    break;
                case 1048:
                    errorMessage += '. ' + 'Column cannot be null';
                    break;
                case 1364:
                    errorMessage += '. ' + 'Field does not have a default value';
                    break;
                case 22001:
                    errorMessage += '. ' + 'String data, right truncated';
                    break;
            }
            console.error('errno', errorObj.error.error.errno);
            console.error('sqlState', errorObj.error.error.sqlState);
            console.error('sqlMessage', errorObj.error.error.sqlMessage);

        }

        parentContext._openSnackBar(errorMessage, 5000, 'fill', 'error');
        // console.error(errorObj.message);

        return of(false);
    }

}
