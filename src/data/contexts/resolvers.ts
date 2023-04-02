/**
 * Internal dependencies.
 */
import actions from './actions';
import {
    companiesDropdownEndpoint,
    contextsEndpoint,
    contextTypesEndpoint,
} from './endpoint';
import {
    ICompanyDropdown,
    IContextFilter,
    IContextTypes,
    IResponseGenerator,
} from '../../interfaces';
import { formatSelect2Data } from '../../utils/Select2Helper';
import { prepareContextDataForDatabase } from './utils';
import { Select2SingleRow } from '../../components/inputs/Select2Input';

const resolvers = {
    *getContexts(filters: IContextFilter) {
        if (filters === undefined) {
            filters = {};
        }

        const queryParam = new URLSearchParams(
            filters as URLSearchParams
        ).toString();

        const response: IResponseGenerator = yield actions.fetchFromAPIUnparsed(
            `${contextsEndpoint}?${queryParam}`
        );
        let totalPage = 0;
        let totalCount = 0;

        if (response.headers !== undefined) {
            totalPage = response.headers.get('X-WP-TotalPages');
            totalCount = response.headers.get('X-WP-Total');
        }

        yield actions.setContexts(response.data);
        yield actions.setTotalPage(totalPage);
        yield actions.setTotal(totalCount);
        return actions.setLoadingContexts(false);
    },

    *getContextDetail(id: number) {
        yield actions.setLoadingContexts(true);
        const path = `${contextsEndpoint}/${id}`;
        const response = yield actions.fetchFromAPI(path);

        if (response.id) {
            const data = prepareContextDataForDatabase(response);

            yield actions.setFormData(data);
        }

        return actions.setLoadingContexts(false);
    },

    *getContextTypes() {
        const response: IResponseGenerator = yield actions.fetchFromAPIUnparsed(
            contextTypesEndpoint
        );

        const contextTypes: Array<IContextTypes> = response.data;

        yield actions.setContextTypes(formatSelect2Data(contextTypes) as Select2SingleRow[]);
    },

    *getCompaniesDropdown() {
        const response: IResponseGenerator = yield actions.fetchFromAPIUnparsed(
            companiesDropdownEndpoint
        );

        const companyDropdowns: Array<ICompanyDropdown> = response.data;

        yield actions.setCompanyDropdowns(formatSelect2Data(companyDropdowns) as Select2SingleRow[]);
    },
};

export default resolvers;
