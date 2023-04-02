import { __ } from '@wordpress/i18n';
import Layout from "../../components/layout/Layout";
import PageHeading from '../../components/layout/PageHeading';
import { useSelect } from '@wordpress/data';
import settingsStore from '../../data/settings';
import { ISettings } from '../../interfaces';
import SettingsForm from '../../components/settings/SettingsForm';
import SettingSubmit from '../../components/settings/SettingSubmit';

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

    /**
     * Get Right Side Content - Create Context form data.
     */
    const pageRightSideContent = (
        <div className="mt-7 fixed invisible md:visible md:top-28 right-10 z-50">
            <SettingSubmit />
        </div>
    );
    
    return (
        <Layout
            title={pageTitleContent}
            slug="settings"
            hasRightSideContent={true}
            rightSideContent={pageRightSideContent}
        >
            <SettingsForm settings={settings} />
        </Layout>
    );
}

export default settings