/**
 * Internal dependencies
 */
import HomePage from '../pages/HomePage';
import JobsPage from '../pages/jobs/JobsPage';
import CreateJob from '../pages/jobs/CreateJob';
import EditJob from '../pages/jobs/EditJob';
import settings from '../pages/settings';

const routes = [
    {
        path: '/',
        element: HomePage,
    },
    {
        path: '/jobs',
        element: JobsPage,
    },
    {
        path: '/jobs/new',
        element: CreateJob,
    },
    {
        path: '/jobs/edit/:id',
        element: EditJob,
    },

    {
        path: '/settings',
        element: settings,
    },
];

export default routes;
