/**
 * External dependencies
 */
import { useSelect } from '@wordpress/data';
import { useNavigate, useParams } from 'react-router-dom';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Layout from '../../components/layout/Layout';
import PageHeading from '../../components/layout/PageHeading';
import ContextForm from '../../components/contexts/ContextForm';
import ContextSubmit from '../../components/contexts/ContextSubmit';
import contextStore from '../../data/contexts';
import { IContext } from '../../interfaces';

export default function EditContext() {
	const navigate = useNavigate();
	const { id } = useParams();

	const backToContextsPage = () => {
		navigate( '/contexts' );
	};

	const contextDetails: IContext = useSelect(
		( select ) => select( contextStore ).getContextDetail( id ),
		[]
	);

	/**
	 * Get Page Content - Title and New Context button.
	 *
	 * @return JSX.Element
	 */
	const pageTitleContent = (
		<div className="">
			<div className="mr-3 mb-4">
				<button
					onClick={ backToContextsPage }
					className="text-gray-dark border-none"
				>
					← { __( 'Back to contexts', 'article-gen' ) }
				</button>
			</div>
			<div className="text-left">
				<PageHeading text={ __( 'Edit Context', 'article-gen' ) } />
			</div>
		</div>
	);

	/**
	 * Get Right Side Content - Create Context form data.
	 */
	const pageRightSideContent = (
		<div className="mt-7 fixed invisible md:visible md:top-28 right-10 z-50">
			<ContextSubmit />
		</div>
	);

	return (
		<Layout
			title={ pageTitleContent }
			slug="edit-context"
			hasRightSideContent={ true }
			rightSideContent={ pageRightSideContent }
		>
			<ContextForm context={ contextDetails } />
		</Layout>
	);
}
