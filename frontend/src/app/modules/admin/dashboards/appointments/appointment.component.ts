import { DatePipe, CurrencyPipe, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {
    ActivatedRoute,
    Router,
    RouterLink,
    RouterOutlet,
} from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { cloneDeep, map } from 'lodash-es';
import { Appointment } from 'app/modules/admin/dashboards/appointments/appointments.types';
import { MatDrawer, MatDrawerToggleResult, MatSidenavModule } from '@angular/material/sidenav';
import { MpgrMediaWatcherService } from '@mpgr/services/media-watcher';
import { AppointmentService } from 'app/modules/admin/dashboards/appointments/appointment.service';

@Component({
    selector: 'appointment',
    templateUrl: './appointment.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatSidenavModule,
        TranslocoModule,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
        MatMenuModule,
        MatTabsModule,
        MatButtonToggleModule,
        MatTableModule,
        NgClass,
        CurrencyPipe,
        DatePipe,
        RouterLink,
        RouterOutlet,

    ],
})
export class AppointmentComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    drawerMode: 'side' | 'over';
    dashboardInfo: any;
    todayAppointments: Appointment[];
    tomorrowAppointments: Appointment[];
    nextAppointments: Appointment[];
    selectedappointment: string = 'ACME Corp. Backend App';
    private _appointmentList: Appointment[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _scheduleDay: string = "today";


    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _appointmentService: AppointmentService,
        private _mpgrMediaWatcherService: MpgrMediaWatcherService,
        private _router: Router
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Get the dashboardInfo
        this._appointmentService.dashboardInfo$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((dashboardInfo) => {

                // Store the dashboardInfo
                this.dashboardInfo = dashboardInfo;
                this._appointmentList = this.todayAppointments = dashboardInfo.appointments.today;
                this.tomorrowAppointments = dashboardInfo.appointments.tomorrow;
                this.nextAppointments = dashboardInfo.appointments.next;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to media query change
        this._mpgrMediaWatcherService
            .onMediaQueryChange$('(min-width: 1440px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {

                // Calculate the drawer mode
                this.drawerMode = state.matches ? 'side' : 'over';
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
    // @ Getters and Setters
    // -----------------------------------------------------------------------------------------------------

    get appointmentList() {
        return this._appointmentList;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

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
     * Change current appointment list
     *
     * @param day
     */
    onToggleScheduleDaySelectorChange(day: string): void {

        this._scheduleDay = day;
        if (day == "today") {
            this._appointmentList = cloneDeep(this.todayAppointments);
        }
        if (day == "tomorrow") {
            this._appointmentList = cloneDeep(this.tomorrowAppointments);
        }
        if (day == "next") {
            this._appointmentList = cloneDeep(this.nextAppointments);
        }
    }

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
     * Open MatDrawer for create and edit appointments
     */
    openMatDrawer(): void {

        this.matDrawer.open();
    }

    /**
     * Close drawer
     * 
     * @param reload
     * @param redirect
     */
    closeMatDrawer(reload: boolean = false, redirect: number | false = false): Promise<MatDrawerToggleResult> {

        if (reload) {
            this.reloadData(redirect);
        }

        return this.matDrawer.close();
    }

    /**
     * Reload all data and redirect if is required
     * 
     * @param redirect
     */
    reloadData(redirect: number | false = false): void {

        this._appointmentService.getData().subscribe((dashboardInfo) => {

            // Store the dashboardInfo
            this.dashboardInfo = dashboardInfo;
            this.todayAppointments = dashboardInfo.appointments.today;
            this.tomorrowAppointments = dashboardInfo.appointments.tomorrow;
            this.nextAppointments = dashboardInfo.appointments.next;
            this.onToggleScheduleDaySelectorChange(this._scheduleDay);

            // redirect if is new appointment
            if (redirect) {
                this._router.navigate([redirect], {
                    relativeTo: this._activatedRoute,
                });
            }

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * _prepareData
     */
    private _prepareData(): void {
        map(this.dashboardInfo.appointments.today, (value) => {

            value['dates'] = {
                start_at: new Date(value['start_at']),
                end_at: new Date(value['end_at']),
            };
            return value;
        });
        map(this.dashboardInfo.appointments.tomorrow, (value) => {

            value['dates'] = {
                start_at: new Date(value['start_at']),
                end_at: new Date(value['end_at']),
            };
            return value;
        });
        map(this.dashboardInfo.appointments.next, (value) => {

            value['dates'] = {
                start_at: new Date(value['start_at']),
                end_at: new Date(value['end_at']),
            };
            return value;
        });
    }
}
