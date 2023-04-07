/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Link } from 'react-router-dom';
import { useSelect, useDispatch } from '@wordpress/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

/**
 * Internal dependencies.
 */
import SettingSubmit from './SettingSubmit';
import settingsStore from '../../data/settings';
import ContextCard from '../contexts/ContextCard';
import SettingFormSidebar from './SettingsFormSidebar';
import { IInputResponse, Input } from '../inputs/Input';
import { ISettingFormData, ISettings } from '../../interfaces';


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
                                    <label htmlFor='openai-api-key' className='block mb-[13px]'>
                                        <strong>
                                            {__('OpenAi API Key', 'article-gen')}
                                        </strong>
                                        <Link 
                                            className='ml-[10px] underline hover:decoration-2' 
                                            to="https://platform.openai.com/account/api-keys"
                                            target="_blank"
                                        >
                                            { __('I don\'t have a key', 'article-gen') + ' ' }
                                            <FontAwesomeIcon icon={faExternalLink} />
                                        </Link>
                                    </label>
                                    <Input
                                        type="password"
                                        //label={__('OpenAi API Key', 'article-gen')}
                                        id="openai-api-key"
                                        key={'openai-api-key'}
                                        labelTooltip={2}
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
