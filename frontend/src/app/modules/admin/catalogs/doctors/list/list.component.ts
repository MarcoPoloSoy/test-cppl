import { AsyncPipe, DOCUMENT, I18nPluralPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { MpgrMediaWatcherService } from '@mpgr/services/media-watcher';
import { DoctorsService } from 'app/modules/admin/catalogs/doctors/doctors.service';
import { Doctor } from 'app/modules/admin/catalogs/doctors/doctors.types';
import { Observable, Subject, debounceTime, filter, fromEvent, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'doctors-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        RouterOutlet,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        NgClass,
        RouterLink,
        AsyncPipe,
        I18nPluralPipe,
        TranslocoModule
    ],
})
export class DoctorsListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    doctors$: Observable<Doctor[]>;

    doctorsCount: number = 0;
    doctorsTableColumns: string[] = ['name', 'lastName', 'phone', 'specialty'];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedDoctor: Doctor;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _doctorsService: DoctorsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _mpgrMediaWatcherService: MpgrMediaWatcherService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the doctors
        this.doctors$ = this._doctorsService.doctors$;
        this._doctorsService.doctors$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((doctors: Doctor[]) => {
                // Update the counts
                this.doctorsCount = doctors.length;

                // this._doctorsClone = doctors;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the doctor
        this._doctorsService.doctor$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((doctor: Doctor) => {
                // Update the selected doctor
                this.selectedDoctor = doctor;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                debounceTime(300),
                switchMap((query) => {

                    // if (!query || query.length < 3) {
                    //     return of(this._doctorsClone);
                    // }
                    // Search
                    return this._doctorsService.searchDoctors(query);
                }
                ),
                takeUntil(this._unsubscribeAll),
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected doctor when drawer closed
                this.selectedDoctor = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._mpgrMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(
                    (event) =>
                        (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
                        event.key === '/' // '/'
                )
            )
            .subscribe(() => {
                this.newDoctor();
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
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create doctor
     */
    newDoctor(): void {
        // Create the doctor
        this._router.navigate(['./', 'new'], {
            relativeTo: this._activatedRoute,
        });

        // this._doctorsService.createDoctor().subscribe((newDoctor) => {
        //     // Go to the new doctor
        //     this._router.navigate(['./', newDoctor.id], {
        //         relativeTo: this._activatedRoute,
        //     });

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
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
