/**
 * External dependencies.
 */
import { scroller } from 'react-scroll';
import { __ } from '@wordpress/i18n';
import Modal from '../modal/Modal';
import Card from '../card/Card';
import Table from '../table/Table';
import Swal from 'sweetalert2';
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config';

type Props = {
	loading?: boolean;
};

export default function SettingFormSidebar( { loading }: Props ) {
	const goToSection = ( className: string ) => {
		scroller.scrollTo( className, {
			duration: 800,
			delay: 0,
			offset: -90,
			smooth: 'easeInOutQuart',
		} );
	};

	const showInfoModal = () => {
		const fullConfig = resolveConfig(tailwindConfig)
		Swal.fire({
			title: __('Article Generator', 'article-gen'),
			text: `Version: ${(window as any)?.article_gen?.version || '1.0.0'}`,
			confirmButtonColor: fullConfig.theme?.colors.primary as string,
		})
	};

	const menus = [
		{
			slug: 'openai-setting',
			label: __( 'OpenAi Settings', 'article-gen' ),
		},
		{
			slug: 'plugin-setting',
			label: __( 'Plugin Settings', 'article-gen' ),
		},
		{
			slug: 'setting-info',
			label: __( 'Information', 'article-gen' ),
		},
	];

	return (
		<div className="bg-white py-5 pl-4 pr-10 mb-3 md:sticky md:top-24">
			<h3 className="text-center font-bold">
				{ __( 'Quick Jump', 'article-gen' ) }
			</h3>
			<ul>
				{ loading ? (
					<>
						<div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
						<div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
						<div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
					</>
				) : (
					<>
						{ menus.map( ( menu, index ) =>
							menu.slug != "setting-info" ? (
								<li
									key={ index }
									className="cursor-pointer text-center transition bg-slate-100 hover:bg-slate-200 p-2.5 rounded-lg mt-5"
									onClick={ () => goToSection( menu.slug ) }
									onKeyDown={ () => goToSection( menu.slug ) }
									// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
									role="button"
								>
									{ menu.label }
								</li>
							) : (
								<li
									key={ index }
									className="cursor-pointer text-center transition bg-slate-100 hover:bg-slate-200 p-2.5 rounded-lg mt-5"
									onClick={ () => showInfoModal() }
									onKeyDown={ () => showInfoModal() }
									// eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
									role="button"
								>
									{ menu.label }
								</li>
							)
						) }
					</>
				) }
			</ul>
		</div>
	);
}
