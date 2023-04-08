/**
 * Internal dependencies.
 */
import { IContext } from '../../interfaces';

export const prepareContextDataForDatabase = ( context: IContext ) => {
	const data = {
		...context,
	};

	if ( context.is_active !== undefined ) {
		data.is_active = context.is_active;
	} else {
		data.is_active = 1;
	}

	// Remove unnecessary data.
	delete data.status;
	delete data._links;

	return data;
};
