import { TextFieldModule } from '@angular/cdk/text-field';
import { JsonPipe, DatePipe, NgClass } from '@angular/common';

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import {
    NavigationEnd,
    Router,
    RouterLink,
} from '@angular/router';
import { MpgrFindByKeyPipe } from '@mpgr/pipes/find-by-key/find-by-key.pipe';
import { MpgrConfirmationService } from '@mpgr/services/confirmation';
import { MpgrCardComponent } from '@mpgr/components/card';
import { AppointmentComponent } from 'app/modules/admin/dashboards/appointments/appointment.component';
import { AppointmentService } from 'app/modules/admin/dashboards/appointments/appointment.service';
import { Appointment, AppointmentStatus, AppointmentHours, AppointmentHoursArray } from 'app/modules/admin/dashboards/appointments/appointments.types';
import { assign, cloneDeep } from 'lodash-es';
import { DateTime } from 'luxon';
import { Subject, debounceTime, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs';
import { Doctor } from 'app/modules/admin/catalogs/doctors/doctors.types';
import { Patient } from 'app/modules/admin/catalogs/patients/patients.types';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'appointments-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    styles: [
        `
            mpgr-card {
                // margin: 16px;
            }

            mpgr-card div.mpgr-card-front,
            mpgr-card div.mpgr-card-back {
                background-color: #fafafa!important;
            }
        `,
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        RouterLink,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        MatRippleModule,
        MatCheckboxModule,
        NgClass,
        MatDatepickerModule,
        MpgrFindByKeyPipe,
        MpgrCardComponent,
        DatePipe,
        JsonPipe,
        TranslocoModule
    ],
})
export class AppointmentDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('reasonField') private _reasonField: ElementRef;

    // Public
    appointment: Appointment;
    appointments: Appointment[];
    doctor: Doctor;
    doctors: Doctor[];
    patient: Patient;
    patients: Patient[];
    appointmentForm: UntypedFormGroup;
    datePipe: DatePipe = new DatePipe('en-US');

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _mysqlDatetimeString = (dateObj: any) => {
        dateObj = new Date(dateObj);
        const day: string = String(dateObj.getDate()).padStart(2, '0');
        const month: string = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year: string = dateObj.getFullYear();
        const hours: string = String(dateObj.getHours()).padStart(2, '0');
        const minutes: string = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds: string = String(dateObj.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    private _updatedData: boolean = false;
    private _redirect: number | false = false;
    // Hours of first and last appointments
    private _appointmentsHours: AppointmentHours = { first: 9, last: 20, hoursInAdvance: 2, selectedHour: null, hours: [] };
    // Filter doctors
    searchDoctorsControl = new FormControl();
    private _filteredDoctors: Doctor[] = [];
    private _doctorSearchTerms: string | null;
    // Filter clients
    searchPatientsControl = new FormControl();
    private _filteredPatients: Patient[] = [];
    private _patientSearchTerms: string | null;
    private _createAppointmentFormValid: boolean = false;


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,
        private _mpgrConfirmationService: MpgrConfirmationService,
        private _router: Router,
        private _appointmentComponent: AppointmentComponent,
        private _appointmentService: AppointmentService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Open the drawer
        this._appointmentComponent.openMatDrawer();

        // Init the appointment form
        this.appointmentForm = this._formBuilder.group({

            id: [''],
            doctorId: [''],
            patientId: [''],
            reason: [''],
            status: [''],
            startAt: [''],
            endAt: [''],
        });

        // Get the doctors
        this._appointmentService.doctors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((doctors: Doctor[]) => {

                this.doctors = doctors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the patients
        this._appointmentService.patients$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((patients: Patient[]) => {

                this.patients = patients;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the appointments
        this._appointmentService.appointments$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((appointments: Appointment[]) => {

                this.appointments = appointments;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the appointment
        this._appointmentService.appointment$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((appointment: Appointment) => {

                // Open the drawer in case it is closed
                this._appointmentComponent.openMatDrawer();
                // Get the appointment
                this.appointment = appointment;
                // Get doctor
                this.doctor = this.doctors.find((item) => item.id === appointment.doctorId) || null;
                // Get patient
                this.patient = this.patients.find((item) => item.id === appointment.patientId) || null;
                // Patch values to the form from the appointment
                this.appointmentForm.patchValue(appointment, { emitEvent: false });
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Update appointment when there is a value change on the appointment form
        this.appointmentForm.valueChanges
            .pipe(
                debounceTime(300),
                tap((value) => {

                    // If exist startAt update dates
                    if (value.startAt) {

                        // Current hour, minutes and seconds from appointment before date change
                        const currentHour = (new Date(this.appointment.startAt)).getHours();
                        const currentMinutes = (new Date(this.appointment.startAt)).getMinutes();
                        const currentSeconds = (new Date(this.appointment.startAt)).getSeconds();

                        // Date startAt from form.
                        const startAt = new Date(value.startAt);
                        const startAtHours = startAt.getHours();

                        // If date is changed
                        if (currentHour !== startAtHours) {
                            // Recalculate hours. 
                            this._appointmentsHours.hours = [];
                            // Verify date out of range
                            if (currentHour <= this._appointmentsHours.first || currentHour >= this._appointmentsHours.last) {

                                startAt.setHours(this._appointmentsHours.first);
                            }
                            else {
                                startAt.setHours(currentHour);
                            }
                            // When date change the hours is reset, this set the old hour, minutes and seconds.
                            startAt.setHours(currentHour);
                            startAt.setMinutes(currentMinutes);
                            startAt.setSeconds(currentSeconds);
                        }

                        // New endAt is the startAt + 1 hour
                        const endAt = new Date(startAt);
                        endAt.setHours(currentHour + 1);

                        // Set date objects
                        value.startAt = startAt;
                        value.endAt = endAt;
                    }

                    // Update the appointment object (verify logic.)
                    this.appointment = assign(this.appointment, value);

                    // If exist startAt set dates to mysql format string
                    if (value.startAt) {

                        // Set mysql datetime format
                        value.startAt = this._mysqlDatetimeString(value.startAt);
                        value.endAt = this._mysqlDatetimeString(value.endAt);
                    }
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((value) => {

                // Logic detect if is a new appointment and mark if is valid
                if (value.id === null) {
                    if (
                        this.isValid(value.reason)
                        && this.isValid(value.doctorId)
                        && this.isValid(value.patientId)
                        && this.isValid(value.status)
                        && this.isValid(value.startAt)
                        && this.isValid(value.endAt)
                    ) {
                        this._createAppointmentFormValid = true
                    }
                    else {
                        this._createAppointmentFormValid = false;
                    }
                }

                // Update the appointment on the server
                if (value.id) {
                    this._appointmentService.updateAppointment(value.id, value).subscribe(
                        (updatedAppointment: Appointment) => {
                            this._updatedData = true;
                        }
                    );
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Search for doctor
        this.searchDoctorsControl.valueChanges.pipe(
            debounceTime(300), // Wait for 300ms after the last keystroke
            distinctUntilChanged() // Only emit if the value has truly changed
        ).subscribe(term => {

            this._doctorSearchTerms = term;
            const lowerCaseSearchText = term.toLowerCase();
            if (!lowerCaseSearchText) {
                this._filteredDoctors = this.doctors.slice(0, 10);
                this._changeDetectorRef.markForCheck();
                return;
            }
            this._filteredDoctors = this.doctors.filter(item => {
                // Check if search text matches in name, category, or description
                return item.name.toLowerCase().includes(lowerCaseSearchText) ||
                    item.lastName.toLowerCase().includes(lowerCaseSearchText) ||
                    item.specialty.toLowerCase().includes(lowerCaseSearchText) ||
                    item.userEmail.toLowerCase().includes(lowerCaseSearchText);
            }).slice(0, 10);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Search for patien
        this.searchPatientsControl.valueChanges.pipe(
            debounceTime(300), // Wait for 300ms after the last keystroke
            distinctUntilChanged() // Only emit if the value has truly changed
        ).subscribe(term => {

            this._patientSearchTerms = term;
            const lowerCaseSearchText = term.toLowerCase();
            if (!lowerCaseSearchText) {
                this._filteredPatients = this.patients.slice(0, 10);
                this._changeDetectorRef.markForCheck();
                return;
            }

            this._filteredPatients = this.patients.filter(item => {
                // Check if search text matches in name, category, or description
                return item.name.toLowerCase().includes(lowerCaseSearchText) ||
                    item.lastName.toLowerCase().includes(lowerCaseSearchText) ||
                    item.userEmail.toLowerCase().includes(lowerCaseSearchText);
            }).slice(0, 10);

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Listen for NavigationEnd event to focus on the reason field
        this._router.events
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter((event) => event instanceof NavigationEnd)
            )
            .subscribe(() => {

                // Focus on the reason field
                this._reasonField.nativeElement.focus();
            });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {

        // Listen for matDrawer opened change
        this._appointmentComponent.matDrawer.openedChange
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter((opened) => opened)
            )
            .subscribe(() => {

                // Focus on the title element
                this._reasonField.nativeElement.focus();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Getters and Setters
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get status of apointments
     * TODO: Implement in the interface
     */
    get appointmentStatus(): AppointmentStatus {
        return {
            scheduled: {
                icon: 'heroicons_mini:clock',
                class: 'text-blue-600',
                classMenu: 'mr-0 text-blue-600 icon-size-4 dark:text-blue-500'
            },
            pending: {
                icon: 'heroicons_mini:question-mark-circle',
                class: 'text-amber-600',
                classMenu: 'mr-0 text-amber-600 icon-size-4 dark:text-amber-500'
            },
            completed: {
                icon: 'heroicons_mini:check-circle',
                class: 'text-green-600',
                classMenu: 'mr-0 text-green-600 icon-size-4 dark:text-green-500'
            },
            cancelled: {
                icon: 'heroicons_mini:x-circle',
                class: 'text-red-600',
                classMenu: 'mr-0 text-red-600 icon-size-4 dark:text-red-500'
            }
        };
    }

    /**
     * Generate array of hours current date selected in startAt
     */
    get appointmentHours(): AppointmentHours {

        if (this._appointmentsHours.hours.length > 0) {
            return this._appointmentsHours;
        }
        let firstAH = cloneDeep(this._appointmentsHours.first);
        let lastAH = cloneDeep(this._appointmentsHours.last + 1); // for add 1 hour to last.
        const todayData = new Date();
        const currentHour = todayData.getHours();
        const startAt = new Date(this.appointment.startAt);
        const isTodayDate = this.isTodayDate(startAt);
        const isDateInFuture = this.isDateInFuture(startAt);
        const selectedHour = startAt.getHours();
        this._appointmentsHours.selectedHour = selectedHour;
        const hourToReserve = isTodayDate ? (currentHour + this._appointmentsHours.hoursInAdvance) : this._appointmentsHours.first;
        const hoursObject: AppointmentHoursArray[] = [];

        for (let i = firstAH; i < lastAH; i++) {

            const date = new Date();
            date.setHours(i); // Set the hour for formatting

            // Format the hour with AM/PM
            const formattedHour = date.toLocaleString('en-US', {
                hour: 'numeric',
                hour12: true
            });

            // Create a string key like '01 AM', '02 PM', etc.
            const key = formattedHour;

            const available = (
                (isTodayDate && i >= hourToReserve)
                || (!isTodayDate && isDateInFuture)
            );

            hoursObject.push({
                key: formattedHour,
                hour: i,
                formatted: formattedHour,
                available: available
            });
        }

        // Save hours
        this._appointmentsHours.hours = hoursObject;

        return this._appointmentsHours;
    }

    /**
     * Filter doctors by search input
     */
    get filteredDoctors(): Doctor[] {

        if (!this.isValid(this._doctorSearchTerms) && this._filteredDoctors.length < 1) {
            this._filteredDoctors = this.doctors.slice(0, 10);
        }

        return this._filteredDoctors;
    }

    /**
     * Filter patients by search input
     */
    get filteredPatients(): Patient[] {

        if (!this.isValid(this._patientSearchTerms) && this._filteredPatients.length < 1) {
            this._filteredPatients = this.patients.slice(0, 10);
        }

        return this._filteredPatients;
    }

    /**
     * Create form validation
     */
    get createAppointmentFormValid(): boolean {

        return this._createAppointmentFormValid;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {

        return this._appointmentComponent.closeMatDrawer(this._updatedData, this._redirect);
    }

    /**
     * Toggle the completed status
     */
    changeStatus(status: string): void {

        // Get the form control for 'completed'
        const completedFormControl = this.appointmentForm.get('status');

        // Toggle the completed status
        completedFormControl.setValue(status);
    }


    /**
     * Set the appointment status
     *
     * @param status
     */
    setAppointmentStatus(status: string): void {

        // Set the value
        this.appointmentForm.get('status').setValue(status);
    }

    /**
     * Check if the appointment is overdue or not
     */
    isOverdue(): boolean {

        const endAt = new Date(this.appointment.endAt);
        const stateIsScheduled = (this.appointment.status === 'scheduled');

        return (
            stateIsScheduled &&
            DateTime.fromISO(endAt.toISOString()).toUnixInteger() <
            DateTime.now().toUnixInteger()
        );
    }

    /**
     * Delete the appointment
     */
    deleteAppointment(): void {

        // Open the confirmation dialog
        const confirmation = this._mpgrConfirmationService.open({
            title: 'Delete appointment',
            message:
                'Are you sure you want to delete this appointment? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                // Get the current appointment's id
                const id = this.appointment.id;
                // Get the next/previous appointment's id
                const currentAppointmentIndex = this.appointments.findIndex(
                    (item) => item.id === id
                );

                // Delete the appointment
                this._appointmentService.deleteAppointment(id).subscribe((isDeleted) => {

                    // Return if the appointment wasn't deleted...
                    if (!isDeleted) {
                        return;
                    }

                    this._updatedData = true;
                    this.closeDrawer();
                });

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {

        return item.id || index;
    }

    /**
     * Check if the date is before today
     *
     * @param date
     */
    isDateInPast(date: Date | string): boolean {

        const eventDateTime = new Date(date);
        const currentDateTime = new Date();

        return eventDateTime.getTime() < currentDateTime.getTime();
    }

    /**
     * Check if the date is after today
     *
     * @param date
     */
    isDateInFuture(date: Date | string): boolean {

        const eventDateTime = new Date(date);
        const currentDateTime = new Date();

        return (
            currentDateTime.getDate() < eventDateTime.getDate()
            && currentDateTime.getMonth() <= eventDateTime.getMonth()
            && currentDateTime.getFullYear() <= eventDateTime.getFullYear()
        );
    }

    /**
     * Check if the date is today
     *
     * @param date
     */
    isTodayDate(date: Date | string) {

        const eventDateTime = new Date(date);
        const currentDateTime = new Date();

        return (
            currentDateTime.getDate() == eventDateTime.getDate()
            && currentDateTime.getMonth() == eventDateTime.getMonth()
            && currentDateTime.getFullYear() == eventDateTime.getFullYear()
        );
    }

    /**
     * Set hour in startAt of appointment
     *
     * @param hour
     */
    setAppointmentTime(hour: string): void {

        const newHour = parseInt(hour);
        const startAt = this.appointmentForm.get('startAt');
        const startAtDate = new Date(startAt.value);
        startAtDate.setHours(newHour);
        const valueToAssign = { startAt: startAtDate.toISOString() };
        this.appointment = assign(this.appointment, valueToAssign);
        startAt.setValue(startAtDate);

        // Force to recalculate hours
        this._appointmentsHours.hours = [];

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Check if not undefined, null or empty.
     *
     * @param value
     */
    isValid(value: any): boolean {

        if (value === null || typeof value === 'undefined') {
            return false;
        }
        if (typeof value === 'string' && value.trim() === '') {
            return false; // Empty string after trimming whitespace
        }
        if (Array.isArray(value) && value.length === 0) {
            return false; // Empty array
        }

        return true;
    }

    /**
     * Change doctor in the appointment.
     *
     * @param doctor
     */
    setNewDoctor(doctor: Doctor) {

        this.appointment = assign(this.appointment, {
            doctorId: doctor.id,
            doctorName: doctor.name,
            doctorLastName: doctor.lastName
        });
        const doctorId = this.appointmentForm.get('doctorId');
        doctorId.setValue(doctor.id);
    }

    /**
     * Change patient in the appointment.
     *
     * @param patient
     */
    setNewPatient(patient: Patient): void {

        this.appointment = assign(this.appointment, {
            patientId: patient.id,
            patientName: patient.name,
            patientLastName: patient.lastName
        });
        const patientId = this.appointmentForm.get('patientId');
        patientId.setValue(patient.id);
    }

    /**
     * Create new appointment.
     */
    createNewAppointment(): void {

        const values = this.appointmentForm.value;
        this._appointmentService.createAppointment(values).subscribe(
            (appointment: Appointment) => {
                if (this.isValid(appointment.id)) {
                    this._updatedData = true;
                    this._redirect = appointment.id;
                    this.closeDrawer();
                }
            }
        );
    }
}
