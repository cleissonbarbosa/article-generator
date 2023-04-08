/**
 * Internal dependencies.
 */
import { IContexts } from '../../interfaces';

export const contextDefaultFormData = {
	id: 0,
	title: '',
	content: '',
	is_active: 1,
};

export const contextDefaultState: IContexts = {
	contexts: [],
	context: {
		...contextDefaultFormData,
	},
	contextTypes: [],
	loadingContexts: false,
	contextsSaving: false,
	contextsDeleting: false,
	totalPage: 0,
	total: 0,
	filters: {},
	form: {
		...contextDefaultFormData,
	},
	companyDropdowns: [],
};
