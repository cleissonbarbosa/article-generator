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
