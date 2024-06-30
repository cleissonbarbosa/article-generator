/**
 * Internal dependencies
 */
import HomePage from '../pages/HomePage';
import ContextsPage from '../pages/contexts/ContextsPage';
import CreateContext from '../pages/contexts/CreateContext';
import EditContext from '../pages/contexts/EditContext';
import settings from '../pages/settings';

const routes = [
	{
		path: '/',
		element: HomePage,
	},
	{
		path: '/contexts',
		element: ContextsPage,
	},
	{
		path: '/contexts/new',
		element: CreateContext,
	},
	{
		path: '/contexts/edit/:id',
		element: EditContext,
	},

	{
		path: '/settings',
		element: settings,
	},
];

export default routes;
