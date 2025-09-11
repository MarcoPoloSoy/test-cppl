import { TextFieldModule } from '@angular/cdk/text-field';
import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation, } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators, } from '@angular/forms';
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
import { DoctorsService } from 'app/modules/admin/catalogs/doctors/doctors.service';
import { Doctor } from 'app/modules/admin/catalogs/doctors/doctors.types';
import { DoctorsListComponent } from 'app/modules/admin/catalogs/doctors/list/list.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'doctors-details',
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
export class DoctorsDetailsComponent implements OnInit, OnDestroy {

    editMode: boolean = false;
    doctor: Doctor;
    doctorForm: UntypedFormGroup;
    doctors: Doctor[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _doctorsListComponent: DoctorsListComponent,
        private _doctorsService: DoctorsService,
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
        this._doctorsListComponent.matDrawer.open();

        // Create the doctor form
        this.doctorForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            userEmail: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],
            specialty: ['', [Validators.required]]

        });

        // Get the doctors
        this._doctorsService.doctors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((doctors: Doctor[]) => {
                this.doctors = doctors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the doctor
        this._doctorsService.doctor$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((doctor: Doctor) => {
                // Open the drawer in case it is closed
                this._doctorsListComponent.matDrawer.open();

                // Get the doctor
                this.doctor = doctor;

                // Patch values to the form
                this.doctorForm.patchValue(doctor);

                // If is new
                if (doctor.id === null) {
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
        return this._doctorsListComponent.matDrawer.close();
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

        if (editMode === false && this.doctor.id === null) {
            this.closeDrawer();
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create the doctor
     */
    createDoctor(): void {
        // Get the doctor object
        const doctor = this.doctorForm.value;

        // Create the doctor on the server
        this._doctorsService
            .createDoctor(doctor)
            .subscribe((newDoctor) => {
                // Toggle the edit mode off
                if (newDoctor) {
                    this.toggleEditMode(false);
                    if (newDoctor && newDoctor['doctorId']) {
                        this._router.navigate(['../', newDoctor['doctorId']], {
                            relativeTo: this._activatedRoute,
                        });
                    }
                }
            });
    }

    /**
     * Update the doctor
     */
    updateDoctor(): void {
        // Get the doctor object
        const doctor = this.doctorForm.value;

        // Update the doctor on the server
        this._doctorsService
            .updateDoctor(doctor.id, doctor)
            .subscribe(() => {
                // Toggle the edit mode off
                this.toggleEditMode(false);
            });
    }

    /**
     * Delete the doctor
     */
    deleteDoctor(): void {
        // Open the confirmation dialog
        const confirmation = this._mpgrConfirmationService.open({
            title: 'Delete doctor',
            message:
                'Are you sure you want to delete this doctor? This action cannot be undone!',
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
                // Get the current doctor's id
                const id = this.doctor.id;

                // Get the next/previous doctor's id
                const currentDoctorIndex = this.doctors.findIndex(
                    (item) => item.id === id
                );

                // Delete the doctor
                this._doctorsService
                    .deleteDoctor(id)
                    .subscribe((isDeleted) => {
                        // Return if the doctor wasn't deleted...
                        if (!isDeleted) {
                            return;
                        }

                        // navigate to the parent
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
