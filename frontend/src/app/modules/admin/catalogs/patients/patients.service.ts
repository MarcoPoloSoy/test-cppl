import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Patient } from 'app/modules/admin/catalogs/patients/patients.types';
import { map as arrayMap, camelCase, isArray, mapKeys, snakeCase } from 'lodash-es';
import {
    BehaviorSubject,
    Observable,
    catchError,
    filter,
    map,
    of,
    switchMap,
    take,
    tap,
    throwError
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientsService {
    // Private
    private _patient: BehaviorSubject<Patient | null> = new BehaviorSubject(
        null
    );
    private _patients: BehaviorSubject<Patient[] | null> = new BehaviorSubject(
        null
    );
    private _patientsClone: BehaviorSubject<Patient[] | null> = new BehaviorSubject(
        null
    );
    // Convert to camelCase for Patients interface
    private _toCamelCaseProperties = <T>(obj: any): T => {
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
     * Getter for patient
     */
    get patient$(): Observable<Patient> {
        return this._patient.asObservable();
    }

    /**
     * Getter for patients
     */
    get patients$(): Observable<Patient[]> {
        return this._patients.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get patients
     */
    getPatients(): Observable<Patient[]> {
        return this._httpClient.get<Patient[]>('api/patients').pipe(
            tap((patients) => {
                patients = this._toCamelCaseProperties(patients);
                this._patients.next(patients);
                this._patientsClone.next(patients);
            })
        );
    }

    /**
     * Search patients with given query
     *
     * @param query
     */
    searchPatients(query: string): Observable<Patient[]> {
        if (query.length < 3) {
            // return this._patientsClone;
            this._patients.next(this._patientsClone.value);
            return this._patients;
        }
        return this._httpClient
            .get<Patient[]>('api/patients/search', {
                params: { q: query },
            })
            .pipe(
                tap((patients) => {
                    patients = this._toCamelCaseProperties(patients);
                    this._patients.next(patients);
                })
            );
    }

    /**
     * Get patient by id
     * 
     * @param id
     */
    getPatientById(id: number | string): Observable<any> {

        // New patient
        if (id == 'new') {
            const newPatient = {
                id: null,
                name: null,
                lastName: null,
                userEmail: null,
                phone: null
            }
            this._patient.next(newPatient);
            return of(newPatient);
        }

        // If patient exist
        return this._patients.pipe(
            take(1),
            map((patients) => {

                // Find the patient
                const patient = patients.find((item) => item.id === id) || null;

                // Update the patient
                this._patient.next(patient);

                // Return the patient
                return patient;
            }),
            switchMap((patient) => {
                if (!patient) {
                    // TODO: Verify deprecation
                    return throwError(
                        'Could not found patient with id of ' + id + '!'
                    );
                }

                return of(patient);
            }),
            catchError((errorObj) => this.catchErrorFn(errorObj, this))
        );
    }

    /**
     * Create patient
     * 
     * @param patient
     */
    createPatient(patient: Patient): Observable<any> {
        patient = this._toSnakeCaseProperties(patient);
        return this.patients$.pipe(
            take(1),
            switchMap((patients) =>
                this._httpClient
                    .post<Patient>('api/patients', patient)
                    .pipe(
                        map((newPatient) => {

                            // Update the patients with the new patient
                            console.log('newPatient', newPatient);
                            patient.id = newPatient['patientId'];
                            patient = this._toCamelCaseProperties(patient);
                            this._patients.next([patient, ...patients]);

                            // Update patient
                            this._patient.next(patient);

                            // Snackbar
                            this._openSnackBar('Patient created.', 5000, 'fill', 'success');

                            // Return the new patient
                            return newPatient;
                        })
                    )
            ),
            catchError((errorObj) => this.catchErrorFn(errorObj, this))
        );
    }

    /**
     * Update patient
     *
     * @param id
     * @param patient
     */
    updatePatient(id: number, patient: Patient): Observable<any> {

        return this.patients$
            .pipe(
                take(1),
                switchMap((patients) => {
                    const data = this._toSnakeCaseProperties(patient) as object;
                    return this._httpClient
                        .patch<Patient>(`api/patients/${id}`, {
                            patient: data,
                        })
                        .pipe(
                            map((updatedPatient) => {

                                updatedPatient = this._toCamelCaseProperties<Patient>(updatedPatient);

                                // Find the index of the updated patient
                                const index = patients.findIndex(
                                    (item) => item.id === id
                                );

                                // Update the patient
                                patients[index] = updatedPatient;

                                // Update the patients
                                this._patients.next(patients);

                                // Update patient
                                this._patient.next(updatedPatient);

                                // Snackbar
                                this._openSnackBar('Patient updated.', 5000, 'fill', 'success');

                                // Return the updated patient
                                return updatedPatient;
                            }),
                            switchMap((updatedPatient) =>
                                this.patient$.pipe(
                                    take(1),
                                    filter((item) => item && item.id === id),
                                    tap(() => {
                                        // Update the patient if it's selected
                                        this._patient.next(updatedPatient);

                                        // Return the updated patient
                                        return updatedPatient;
                                    })
                                )
                            )
                        )
                }),
                catchError((errorObj) => this.catchErrorFn(errorObj, this))
            );
    }

    /**
     * Delete the patient
     *
     * @param id
     */
    deletePatient(id: number | string): Observable<boolean> {
        return this.patients$.pipe(
            take(1),
            switchMap((patients) =>
                this._httpClient
                    .delete(`api/patients/${id}`)
                    .pipe(
                        map((resp: any) => {
                            // Find the index of the deleted patient
                            const index = patients.findIndex(
                                (item) => item.id === id
                            );

                            if (resp && resp.deleted) {
                                this._openSnackBar(resp.message, 5000, 'fill', 'info');
                            }
                            else {
                                this._openSnackBar('Unknown error.', 5000, 'fill', 'error');
                                console.error('Unknown error.', resp);
                            }

                            // Delete the patient
                            patients.splice(index, 1);

                            // Update the patients
                            this._patients.next(patients);

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
