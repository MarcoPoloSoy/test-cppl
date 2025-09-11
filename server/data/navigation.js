const defaultNavigation = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        // subtitle: 'Unique dashboard designs',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'dashboard.appointments',
                title: 'Appointments',
                type: 'basic',
                icon: 'heroicons_outline:calendar-days',
                link: '/dashboard/appointments',
            }
        ],
    },
    {
        id: 'catalogs',
        title: 'Catalogs',
        subtitle: 'Catalog of patients and doctors',
        type: 'group',
        icon: 'heroicons_outline:book-open',
        children: [
            {
                id: 'catalogs.doctors',
                title: 'Doctors',
                type: 'basic',
                icon: 'heroicons_outline:lifebuoy',
                link: '/catalogs/doctors',
            },
            {
                id: 'catalogs.patients',
                title: 'Patients',
                type: 'basic',
                icon: 'heroicons_outline:user-group',
                link: '/catalogs/patients',
            },
        ]
    }
];
const compactNavigation = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        tooltip: 'Dashboard',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'catalogs',
        title: 'Catalogs',
        tooltip: 'Catalogs',
        type: 'group',
        icon: 'heroicons_outline:book-open',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
const futuristicNavigation = [
    {
        id: 'dashboard',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'catalogs',
        title: 'Catalogs',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
const horizontalNavigation = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'catalogs',
        title: 'Catalogs',
        type: 'group',
        icon: 'heroicons_outline:book-open',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];

module.exports = {
    defaultNavigation,
    compactNavigation,
    futuristicNavigation,
    horizontalNavigation
}
