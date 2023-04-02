/**
 * Internal dependencies.
 */
import { ISelect2Input } from '../components/inputs/Select2Input';

export interface IContext {
    /**
     * Context ID.
     */
    id: number;

    /**
     * Context title.
     */
    title: string;

    /**
     * Context description.
     */
    description: string;

    /**
     * Context Type ID.
     */
    context_type_id: number;

    /**
     * Company ID.
     */
    company_id: number;

    /**
     * Status published or draft
     */
    is_active: boolean | number;

    /**
     * Context status.
     */
    status?: 'draft' | 'published' | 'trashed';
}

export interface IContextFormData extends IContext {}

export interface IContexts {
    /**
     * All company list dropdown as array of {label, value}.
     */
    companyDropdowns: Array<ISelect2Input>;

    /**
     * All contexts as array of IContext.
     */
    contexts: Array<IContext>;

    /**
     * Context detail.
     */
    context: IContext;

    /**
     * Context saving or not.
     */
    contextsSaving: boolean;

    /**
     * Context deleting or not.
     */
    contextsDeleting: boolean;

    /**
     * All context types as array of {label, value}.
     */
    contextTypes: Array<ISelect2Input>;

    /**
     * Is contexts loading.
     */
    loadingContexts: boolean;

    /**
     * Count total page.
     */
    totalPage: number;

    /**
     * Count total number of data.
     */
    total: number;

    /**
     * Context list filter.
     */
    filters: object;

    /**
     * Context Form data.
     */
    form: IContextFormData;
}

export interface IContextFilter {
    /**
     * Context filter by page no.
     */
    page?: number;

    /**
     * Context search URL params.
     */
    search?: string;
}

export interface IContextTypes {
    /**
     * Context type id.
     */
    id: number;

    /**
     * Context type name.
     */
    name: string;

    /**
     * Context type slug.
     */
    slug: string;

    /**
     * Context type description.
     */
    description: string | null;
}

export interface ICompanyDropdown {
    /**
     * Company id.
     */
    id: number;

    /**
     * Company name.
     */
    name: string;

    /**
     * Company email.
     */
    email: string;

    /**
     * Username.
     */
    username: string;
}
