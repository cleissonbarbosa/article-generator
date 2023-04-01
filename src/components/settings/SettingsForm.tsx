/**
 * External dependencies.
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import JobCard from '../jobs/JobCard';
import settingsStore from '../../data/settings';
import SettingFormSidebar from './SettingsFormSidebar';
import { IInputResponse, Input } from '../inputs/Input';
import { ISettingFormData, ISettings } from '../../interfaces';
import SettingSubmit from './SettingSubmit';

interface Props {
    settings?: ISettings
}
export default function SettingsForm({ settings } : Props) {
    const dispatch = useDispatch();

    const form: ISettingFormData = useSelect(
        (select) => select(settingsStore).getForm(),
        []
    );

    const loadingSettings: boolean = useSelect(
        (select) => select(settingsStore).getLoadingSettings(),
        []
    );

    const onChange = (input: IInputResponse) => {
        dispatch(settingsStore).setFormData([...new Map([
            ...form,
            ...[{
                key: input.name,
                value: typeof input.value === 'object'
                    ? input.value?.value
                    : input.value
                }]
        ].map(item =>[item['key'], item])).values()]);
    };

    return (
        <div className="mt-10">
            <form>
                <div className="flex flex-col md:flex-row">
                    <div className="md:basis-1/5">
                        <SettingFormSidebar loading={loadingSettings} />
                    </div>

                    {loadingSettings ? (
                        <div className="md:basis-4/5">
                            <JobCard>
                                <div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
                                <div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
                                <div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
                            </JobCard>
                        </div>
                    ) : (
                        <>
                            <div className="md:basis-4/5">
                                <JobCard className="setting-general-info">
                                    <Input
                                        type="password"
                                        label={__('OpenAi API Key', 'article-gen')}
                                        id="openai-api-key"
                                        key={'openai-api-key'}
                                        placeholder={__(
                                            'Enter a openai api key',
                                            'article-gen'
                                        )}
                                        value={form[0]?.value}
                                        onChange={onChange}
                                    />
                                </JobCard>
                                <div className="flex justify-end">
                                    <SettingSubmit />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
