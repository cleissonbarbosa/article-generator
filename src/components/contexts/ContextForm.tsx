/**
 * External dependencies.
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ContextCard from './ContextCard';
import ContextSubmit from './ContextSubmit';
import contextStore from '../../data/contexts';
import ContextFormSidebar from './ContextFormSidebar';
import { IInputResponse, Input } from '../inputs/Input';
import { Select2SingleRow } from '../inputs/Select2Input';
import { IContext, IContextFormData } from '../../interfaces';

type Props = {
	context?: IContext;
};

export default function ContextForm( { context }: Props ) {
	const dispatch = useDispatch();

	const form: IContextFormData = useSelect(
		( select ) => select( contextStore ).getForm(),
		[]
	);

	const loadingContexts: boolean = useSelect(
		( select ) => select( contextStore ).getLoadingContexts(),
		[]
	);

	const onChange = ( input: IInputResponse ) => {
		dispatch( contextStore ).setFormData( {
			...form,
			[ input.name ]:
				typeof input.value === 'object'
					? input.value?.value
					: input.value,
		} );
	};

	return (
		<div className="mt-10">
			<form>
				<div className="flex flex-col md:flex-row">
					<div className="md:basis-1/5">
						<ContextFormSidebar loading={ loadingContexts } />
					</div>

					{ loadingContexts ? (
						<div className="md:basis-4/5">
							<ContextCard>
								<div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
							</ContextCard>
							<ContextCard>
								<div className="animate-pulse h-[200px] bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
							</ContextCard>
						</div>
					) : (
						<>
							<div className="md:basis-4/5">
								<ContextCard className="context-general-info">
									<Input
										type="text"
										label={ __(
											'Context title',
											'article-gen'
										) }
										id="title"
										placeholder={ __(
											'Enter Context title, eg: Life Style',
											'article-gen'
										) }
										value={ form.title }
										onChange={ onChange }
									/>
								</ContextCard>
								<ContextCard className="context-content-info">
									<Input
										type="textarea"
										label={ __(
											'Context details',
											'article-gen'
										) }
										id="content"
										rows={ 8 }
										placeholder={ __(
											'Enter Context content.',
											'article-gen'
										) }
										editorHeight="150px"
										value={ form.content }
										onChange={ onChange }
									/>
								</ContextCard>
								<div className="flex justify-end md:hidden">
									<ContextSubmit />
								</div>
							</div>
						</>
					) }
				</div>
			</form>
		</div>
	);
}
