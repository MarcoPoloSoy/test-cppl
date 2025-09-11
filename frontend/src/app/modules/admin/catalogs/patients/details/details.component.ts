import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { MpgrFindByKeyPipe } from '@mpgr/pipes/find-by-key/find-by-key.pipe';
import { MpgrConfirmationService } from '@mpgr/services/confirmation';
import { PatientsService } from 'app/modules/admin/catalogs/patients/patients.service';
import { Patient } from 'app/modules/admin/catalogs/patients/patients.types';
import { PatientsListComponent } from 'app/modules/admin/catalogs/patients/list/list.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'patients-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatButtonModule,
        MatTooltipModule,
        RouterLink,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        NgClass,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        TextFieldModule,
        MpgrFindByKeyPipe,
        DatePipe,
        TranslocoModule
    ],
})
export class PatientsDetailsComponent implements OnInit, OnDestroy {

    editMode: boolean = false;
    patient: Patient;
    patientForm: UntypedFormGroup;
    patients: Patient[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _patientsListComponent: PatientsListComponent,
        private _patientsService: PatientsService,
        private _formBuilder: UntypedFormBuilder,
        private _mpgrConfirmationService: MpgrConfirmationService,
        private _router: Router
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this._patientsListComponent.matDrawer.open();

        // Create the patient form
        this.patientForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            userEmail: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],


        });

        // Get the patients
        this._patientsService.patients$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((patients: Patient[]) => {
                this.patients = patients;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the patient
        this._patientsService.patient$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((patient: Patient) => {
                // Open the drawer in case it is closed
                this._patientsListComponent.matDrawer.open();

                // Get the patient
                this.patient = patient;

                // Patch values to the form
                this.patientForm.patchValue(patient);

                // If is new
                if (patient.id === null) {
                    this.toggleEditMode(true);
                }
                else {
                    this.toggleEditMode(false);
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._patientsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {

        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        if (editMode === false && this.patient.id === null) {
            this.closeDrawer();
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create patient
     */
    createPatient(): void {
        // Get the patient object
        const patient = this.patientForm.value;

        // Update the patient on the server
        this._patientsService
            .createPatient(patient)
            .subscribe((newPatient) => {
                // Toggle the edit mode off
                if (newPatient) {
                    this.toggleEditMode(false);
                    if (newPatient && newPatient['patientId']) {
                        this._router.navigate(['../', newPatient['patientId']], {
                            relativeTo: this._activatedRoute,
                        });
                    }
                }
            });
    }

    /**
     * Update the patient
     */
    updatePatient(): void {
        // Get the patient object
        const patient = this.patientForm.value;

        // Update the patient on the server
        this._patientsService
            .updatePatient(patient.id, patient)
            .subscribe(() => {
                // Toggle the edit mode off
                this.toggleEditMode(false);
            });
    }

    /**
     * Delete the patient
     */
    deletePatient(): void {
        // Open the confirmation dialog
        const confirmation = this._mpgrConfirmationService.open({
            title: 'Delete patient',
            message:
                'Are you sure you want to delete this patient? This action cannot be undone!',
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
                // Get the current patient's id
                const id = this.patient.id;

                // Get the next/previous patient's id
                const currentPatientIndex = this.patients.findIndex(
                    (item) => item.id === id
                );

                // Delete the patient
                this._patientsService
                    .deletePatient(id)
                    .subscribe((isDeleted) => {
                        // Return if the patient wasn't deleted...
                        if (!isDeleted) {
                            return;
                        }

                        // Navigate to the parent
                        this._router.navigate(['../'], {
                            relativeTo: this._activatedRoute,
                        });

                        // Toggle the edit mode off
                        this.toggleEditMode(false);
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
}
