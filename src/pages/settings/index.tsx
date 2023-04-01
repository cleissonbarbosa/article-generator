import { __ } from '@wordpress/i18n';
import Layout from "../../components/layout/Layout";
import PageHeading from '../../components/layout/PageHeading';
import SettingSubmit from '../../components/settings/SettingSubmit';
import { useSelect } from '@wordpress/data';
import settingsStore from '../../data/settings';
import { ISetting, ISettings } from '../../interfaces';
import SettingsOpenAiKeyForm from '../../components/settings/SettingsForm';
import SettingsOpenAiKey2Form from '../../components/settings/SettingsOpenAiKey2Form';

const settings = () => {

    const pageTitleContent = (
        <div className="">
            <div className="text-left">
                <PageHeading text={__('Settings', 'article-gen')} />
            </div>
        </div>
    );

    const settings: ISettings = useSelect(
        (select) => select(settingsStore).getSettings(),
        []
    );
    
    return (
        <Layout
            title={pageTitleContent}
            slug="settings"
            hasRightSideContent={true}
        >
            <SettingsOpenAiKeyForm settings={settings} />
        </Layout>
    );
}

export default settings