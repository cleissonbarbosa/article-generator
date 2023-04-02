/**
 * Internal dependencies.
 */
import { IContext, ISetting } from '../../interfaces';

export const prepareSettingDataForDatabase = (setting: ISetting) => {
    const data = {
        ...setting
    };

    delete data.status;
    delete data.updated_at;
    delete data.created_at;
    delete data._links;

    return data;
};
