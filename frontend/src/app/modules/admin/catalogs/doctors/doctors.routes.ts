import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { DoctorsComponent } from 'app/modules/admin/catalogs/doctors/doctors.component';
import { DoctorsService } from 'app/modules/admin/catalogs/doctors/doctors.service';
import { DoctorsDetailsComponent } from 'app/modules/admin/catalogs/doctors/details/details.component';
import { DoctorsListComponent } from 'app/modules/admin/catalogs/doctors/list/list.component';
import { catchError, throwError } from 'rxjs';

/**
 * Doctor resolver
 *
 * @param route
 * @param state
 */
const doctorResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const doctorsService = inject(DoctorsService);
    const router = inject(Router);
    const paramId = route.paramMap.get('id');
    const doctoId = !isNaN(Number(paramId)) ? Number(paramId) : paramId;

    return doctorsService.getDoctorById(doctoId).pipe(
        // Error here means the requested doctor is not available
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
 * Can deactivate doctors details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateDoctorsDetails = (
    component: DoctorsDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/doctors'
    // it means we are navigating away from the
    // doctors app
    if (!nextState.url.includes('/doctors')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another doctor...
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
        component: DoctorsComponent,
        resolve: {
            // tags: () => inject(DoctorsService).getTags(),
        },
        children: [
            {
                path: '',
                component: DoctorsListComponent,
                resolve: {
                    doctors: () => inject(DoctorsService).getDoctors(),
                },
                children: [
                    {
                        path: ':id',
                        component: DoctorsDetailsComponent,
                        resolve: {
                            doctor: doctorResolver,
                        },
                        canDeactivate: [canDeactivateDoctorsDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
