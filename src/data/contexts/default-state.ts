/**
 * Internal dependencies.
 */
import { IContexts } from '../../interfaces';

export const contextDefaultFormData = {
    id: 0,
    title: '',
    description: '',
    context_type_id: 0,
    company_id: 0,
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
