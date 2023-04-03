/**
 * External dependencies.
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import ContextCard from '../contexts/ContextCard';
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
    //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
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
                            <ContextCard>
                                <div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
                                <div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
                                <div className="animate-pulse h-4 bg-slate-100 w-full p-2.5 rounded-lg mt-5"></div>
                            </ContextCard>
                        </div>
                    ) : (
                        <>
                            <div className="md:basis-4/5">
                                <ContextCard className="openai-setting">
                                    <Input
                                        type="password"
                                        label={__('OpenAi API Key', 'article-gen')}
                                        id="openai-api-key"
                                        key={'openai-api-key'}
                                        placeholder={__(
                                            'Enter a openai api key',
                                            'article-gen'
                                        )}
                                        required={true}
                                        value={ form.length > 0 ? form.filter((input) => input.key === 'openai-api-key').map((e) => e?.value) : '' }
                                        onChange={onChange}
                                    />
                                    <Input
                                        type="text"
                                        label={__('OpenAi Organization ID', 'article-gen')}
                                        id="openai-organization-id"
                                        key={'openai-organization-id'}
                                        placeholder={__(
                                            'Enter a openai organization',
                                            'article-gen'
                                        )}
                                        value={ form.length > 0 ? form?.filter((input) => input.key === 'openai-organization-id').map((e) => e?.value) : '' }
                                        onChange={onChange}
                                    />
                                </ContextCard>
                                <div className="flex justify-end md:hidden">
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
