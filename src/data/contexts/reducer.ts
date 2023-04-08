/**
 * Internal dependencies.
 */
import * as Types from './types';
import { contextDefaultState } from './default-state';

const reducer = ( state = contextDefaultState, action: any ) => {
	switch ( action.type ) {
		case Types.GET_CONTEXTS:
			return {
				...state,
				contexts: action.contexts,
			};

		case Types.GET_CONTEXT_DETAIL:
			return {
				...state,
				context: action.context,
			};

		case Types.SET_LOADING_CONTEXTS:
			return {
				...state,
				loadingContexts: action.loadingContexts,
			};

		case Types.SET_TOTAL_CONTEXTS:
			return {
				...state,
				total: action.total,
			};

		case Types.SET_TOTAL_CONTEXTS_PAGE:
			return {
				...state,
				totalPage: action.totalPage,
			};

		case Types.SET_CONTEXTS_FILTER:
			return {
				...state,
				filters: action.filters,
			};

		case Types.SET_CONTEXT_FORM_DATA:
			return {
				...state,
				form: action.form,
			};

		case Types.SET_CONTEXTS_SAVING:
			return {
				...state,
				contextsSaving: action.contextsSaving,
			};
	}

	return state;
};

export default reducer;
