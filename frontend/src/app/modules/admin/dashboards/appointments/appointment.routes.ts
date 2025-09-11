import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes
} from '@angular/router';
import { AppointmentComponent } from 'app/modules/admin/dashboards/appointments/appointment.component';
import { AppointmentDetailsComponent } from 'app/modules/admin/dashboards/appointments/details/details.component';
import { AppointmentService } from 'app/modules/admin/dashboards/appointments/appointment.service';
import { catchError, throwError } from 'rxjs';


/**
 * Appointment resolver
 *
 * @param route
 * @param state
 */
const appointmentResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const appointmentService = inject(AppointmentService);
    const router = inject(Router);
    const paramId = route.paramMap.get('id');
    console.log('paramId', paramId);
    console.log('typeof', typeof paramId);
    const appointmentId = !isNaN(Number(paramId)) ? Number(paramId) : paramId;
    console.log('appointmentId', appointmentId);

    return appointmentService.getAppointmentById(appointmentId).pipe(
        // Error here means the requested appointment is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

/**
 * Can deactivate tasks details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateAppointmentsDetails = (
    component: AppointmentDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/tasks'
    // it means we are navigating away from the
    // tasks app
    if (!nextState.url.includes('/appointments')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another appointment...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: AppointmentComponent,
        resolve: {
            data: () => inject(AppointmentService).getData(),
        },
        children: [
            {
                path: ':id',
                component: AppointmentDetailsComponent,
                resolve: {
                    appointment: appointmentResolver,
                },
                canDeactivate: [canDeactivateAppointmentsDetails],
            },
        ],
    },
] as Routes;
