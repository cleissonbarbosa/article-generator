/**
 * Internal dependencies.
 */

import { IContexts } from '../../interfaces';

const selectors = {
	getContexts( state: IContexts ) {
		const { contexts } = state;

		return contexts;
	},

	getContextDetail( state: IContexts ) {
		const { context } = state;

		return context;
	},

	getContextsSaving( state: IContexts ) {
		const { contextsSaving } = state;

		return contextsSaving;
	},

	getContextsDeleting( state: IContexts ) {
		const { contextsDeleting } = state;

		return contextsDeleting;
	},

	getLoadingContexts( state: IContexts ) {
		const { loadingContexts } = state;

		return loadingContexts;
	},

	getTotalPage( state: IContexts ) {
		const { totalPage } = state;

		return totalPage;
	},

	getTotal( state: IContexts ) {
		const { total } = state;

		return total;
	},

	getFilter( state: IContexts ) {
		const { filters } = state;

		return filters;
	},

	getForm( state: IContexts ) {
		const { form } = state;

		return form;
	},
};

export default selectors;
