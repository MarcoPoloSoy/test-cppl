import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { PatientsComponent } from 'app/modules/admin/catalogs/patients/patients.component';
import { PatientsService } from 'app/modules/admin/catalogs/patients/patients.service';
import { PatientsDetailsComponent } from 'app/modules/admin/catalogs/patients/details/details.component';
import { PatientsListComponent } from 'app/modules/admin/catalogs/patients/list/list.component';
import { catchError, throwError } from 'rxjs';

/**
 * Patient resolvers
 *
 * @param route
 * @param state
 */
const patientResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const patientsService = inject(PatientsService);
    const router = inject(Router);
    const paramId = route.paramMap.get('id');
    const doctoId = !isNaN(Number(paramId)) ? Number(paramId) : paramId;

    return patientsService.getPatientById(doctoId).pipe(
        // Error here means the requested patient is not available
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
 * Can deactivate patients details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivatePatientsDetails = (
    component: PatientsDetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/patients'
    // it means we are navigating away from the
    // patients app
    if (!nextState.url.includes('/patients')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another patient...
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
        component: PatientsComponent,
        resolve: {},
        children: [
            {
                path: '',
                component: PatientsListComponent,
                resolve: {
                    patients: () => inject(PatientsService).getPatients(),
                },
                children: [
                    {
                        path: ':id',
                        component: PatientsDetailsComponent,
                        resolve: {
                            patient: patientResolver,
                        },
                        canDeactivate: [canDeactivatePatientsDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
