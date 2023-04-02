/**
 * External dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { useNavigate } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from '../../components/button/Button';
import Layout from '../../components/layout/Layout';
import Table from '../../components/table/Table';
import TableLoading from '../../components/loading/TableLoading';
import PageHeading from '../../components/layout/PageHeading';
import { useSelect, useDispatch } from '@wordpress/data';
import store from '../../data/contexts';
import {
    useTableHeaderData,
    useTableRowData,
} from '../../components/contexts/use-table-data';
import SelectCheckBox from '../../components/contexts/SelectCheckBox';
import { Input } from '../../components/inputs/Input';
import { IContext, IContextFilter } from '../../interfaces';

export default function ContextsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [page, setPage] = useState(
        new URLSearchParams(location.search).get('pages') || 1
    );
    const searched = new URLSearchParams(location.search).get('s');
    const [search, setSearch] = useState<string>(
        typeof searched === 'string' ? searched : ''
    );
    const [checkedAll, setCheckedAll] = useState(false);

    const contexts: Array<IContext> = useSelect(
        (select) => select(store).getContexts({}),
        []
    );
    const totalContexts: number = useSelect(
        (select) => select(store).getTotal(),
        []
    );
    const contextFilters: IContextFilter = useSelect(
        (select) => select(store).getFilter(),
        []
    );
    const loadingContexts: boolean = useSelect(
        (select) => select(store).getLoadingContexts(),
        []
    );

    useEffect(() => {
        dispatch(store).setFilters({
            ...contextFilters,
            page,
            search,
        });
    }, [page, search]);

    /**
     * Process search-bar, tab and pagination clicks.
     *
     * @param  pagePassed
     * @param  searchPassed
     * @return {void}
     */
    const processAndNavigate = (
        pagePassed: number = 0,
        searchPassed: string | null = null
    ) => {
        const pageData = pagePassed === 0 ? page : pagePassed;
        const searchData = searchPassed === '' ? search : searchPassed;
        navigate(`/contexts?pages=${pageData}&s=${searchData}`);
        setPage(pageData);

        dispatch(store).setFilters({
            ...contextFilters,
            page: pageData,
            search: searchData,
        });
    };

    // TODO: Implement this later.
    const [checked, setChecked] = useState<Array<number>>([]);
    const checkContext = (contextId: number, isChecked = false) => {
        const contextsData = [];
        if (contextId === 0) {
            if (isChecked) {
                contextsData.push(...contexts.map((context) => context.id));
            }
            setChecked(contextsData);
        } else {
            setChecked([...checked, contextId]);
        }
    };

    /**
     * Handle Checked and unchecked.
     */
    useEffect(() => {
        if (contexts.length === checked.length && checked.length > 0) {
            setCheckedAll(true);
        } else {
            setCheckedAll(false);
        }
    }, [contexts, checked]);

    /**
     * Get Page Content - Title and New Context button.
     *
     * @return JSX.Element
     */
    const pageTitleContent = (
        <div className="flex">
            <div className="flex-6 mr-3">
                <PageHeading text={__('Contexts', 'article-gen')} />
            </div>
            <div className="flex-1 text-left">
                <Button
                    text={__('New', 'article-gen')}
                    type="primary"
                    icon={faPlus}
                    onClick={() => navigate('/contexts/new')}
                />
            </div>
        </div>
    );

    /**
     * Get Right Side Content - Contexts Search Input.
     *
     * @param  data
     */
    const pageRightSideContent = (
        <Input
            type="text"
            placeholder={__('Search Contexts…', 'article-gen')}
            onChange={(data) => {
                setSearch(data.value);
                processAndNavigate(page, data.value);
            }}
            value={search}
            className="w-full md:w-80"
        />
    );

    const tableResponsiveColumns = ['sl', 'title', 'actions'];
    const tableHeaders = useTableHeaderData();
    const tableRows = useTableRowData(contexts, checked);

    return (
        <Layout
            title={pageTitleContent}
            slug="contexts"
            hasRightSideContent={true}
            rightSideContent={pageRightSideContent}
        >
            {loadingContexts ? (
                <TableLoading
                    headers={tableHeaders}
                    responsiveColumns={tableResponsiveColumns}
                    hasCheckbox={false}
                    count={5}
                />
            ) : (
                <>
                    {checked.length > 0 && (
                        <SelectCheckBox
                            checked={checked}
                            onChange={(response) => checkContext()}
                        />
                    )}

                    <Table
                        headers={tableHeaders}
                        rows={tableRows}
                        totalItems={totalContexts}
                        perPage={10}
                        onCheckAll={(isChecked: boolean) => {
                            checkContext(0, isChecked);
                            setCheckedAll(isChecked);
                        }}
                        responsiveColumns={tableResponsiveColumns}
                        checkedAll={checkedAll}
                        noDataMessage={__(
                            'Sorry !! No contexts found…',
                            'article-gen'
                        )}
                        currentPage={
                            typeof page === 'number' ? parseInt(page) : 1
                        }
                        onChangePage={(page) =>
                            processAndNavigate(page, search)
                        }
                    />
                </>
            )}
        </Layout>
    );
}
