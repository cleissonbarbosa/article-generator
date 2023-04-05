/**
 * Internal dependencies.
 */
import { IContext, IContextFormData, IResponseGenerator } from '../../interfaces';
import { contextsEndpoint } from './endpoint';
import * as Types from './types';
import { contextDefaultFormData } from './default-state';

const actions = {
    setContexts(contexts: Array<IContext>) {
        return {
            type: Types.GET_CONTEXTS,
            contexts,
        };
    },

    setContextDetail(context: IContext) {
        return {
            type: Types.GET_CONTEXT_DETAIL,
            context,
        };
    },

    setFormData(form: IContextFormData) {
        return {
            type: Types.SET_CONTEXT_FORM_DATA,
            form,
        };
    },

    setLoadingContexts(loadingContexts: boolean) {
        return {
            type: Types.SET_LOADING_CONTEXTS,
            loadingContexts,
        };
    },

    setSavingContexts(contextsSaving: boolean) {
        return {
            type: Types.SET_CONTEXTS_SAVING,
            contextsSaving,
        };
    },

    setDeletingContexts(contextsDeleting: boolean) {
        return {
            type: Types.SET_CONTEXTS_DELETING,
            contextsDeleting,
        };
    },

    *setFilters(filters = {}) {
        yield actions.setLoadingContexts(true);
        yield actions.setFilterObject(filters);

        const queryParam = new URLSearchParams(
            filters as URLSearchParams
        ).toString();

        const path = `${contextsEndpoint}?${queryParam}`;
        const response: {
            headers: Headers;
            data;
        } = yield actions.fetchFromAPIUnparsed(path);

        let totalPage = 0;
        let totalCount = 0;

        if (response.headers !== undefined) {
            totalPage = parseInt(response.headers.get('X-WP-TotalPages'));
            totalCount = parseInt(response.headers.get('X-WP-Total'));
        }

        yield actions.setTotalPage(totalPage);
        yield actions.setTotal(totalCount);
        yield actions.setContexts(response.data);
        return actions.setLoadingContexts(false);
    },

    setFilterObject(filters: object) {
        return {
            type: Types.SET_CONTEXTS_FILTER,
            filters,
        };
    },

    *saveContext(payload: IContextFormData) {
        yield actions.setSavingContexts(true);

        try {
            let response: IResponseGenerator = {};
            if (payload.id > 0) {
                response = yield {
                    type: Types.UPDATE_CONTEXTS,
                    payload,
                };
            } else {
                response = yield {
                    type: Types.CREATE_CONTEXTS,
                    payload,
                };
            }

            if (response?.id > 0) {
                yield actions.setFormData({ ...contextDefaultFormData });
                yield actions.setSavingContexts(false);
            }
        } catch (error) {
            yield actions.setSavingContexts(false);
        }
    },

    setTotalPage(totalPage: number) {
        return {
            type: Types.SET_TOTAL_CONTEXTS_PAGE,
            totalPage,
        };
    },

    setTotal(total: number) {
        return {
            type: Types.SET_TOTAL_CONTEXTS,
            total,
        };
    },

    fetchFromAPI(path: string) {
        return {
            type: Types.FETCH_FROM_API,
            path,
        };
    },

    fetchFromAPIUnparsed(path: string) {
        return {
            type: Types.FETCH_FROM_API_UNPARSED,
            path,
        };
    },

    *deleteContexts(payload: Array<number>) {
        yield actions.setDeletingContexts(true);

        try {
            const responseDeleteContexts: IResponseGenerator = yield {
                type: Types.DELETE_CONTEXTS,
                payload,
            };

            if (responseDeleteContexts?.total > 0) {
                yield actions.setFilters({});
            }

            yield actions.setDeletingContexts(false);
        } catch (error) {
            yield actions.setDeletingContexts(false);
        }
    },
};

export default actions;
