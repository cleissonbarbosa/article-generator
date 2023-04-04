/**
 * External dependencies.
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import settingStore from '../../data/settings';
import Button from '../button/Button';
import { ISettingFormData } from '../../interfaces';

export default function SettingSubmit() {
    const dispatch = useDispatch();

    const form: ISettingFormData = useSelect(
        (select) => select(settingStore).getForm(),
        []
    );

    const settingsSaving: boolean = useSelect(
        (select) => select(settingStore).getSettingsSaving(),
        []
    );

    const validate = () => {
        for(const data of form){
            if (!data.value.length && data.key != 'openai-organization-id') {
                return sprintf( __(`Please give a setting value to %s.`, 'article-gen'), data.key);
            }
        }

        return '';
    };

    const onSubmit = () => {
        //Validate
        if (validate().length > 0) {
            Swal.fire({
                title: __('Error', 'article-gen'),
                text: validate(),
                icon: 'error',
                toast: true,
                position: 'bottom',
                showConfirmButton: false,
                timer: 4000,
            });

            return;
        }

        // Submit
        dispatch(settingStore)
            .saveSetting(form)
            .then((response: any) => {

                if(response?.code) {
                    return Swal.fire({
                        title: __('Error', 'article-gen'),
                        text: response.message,
                        icon: 'error',
                        toast: true,
                        position: 'bottom',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }

                Swal.fire({
                    title: __('Setting saved', 'article-gen'),
                    text: __('Setting has been saved successfully.', 'article-gen'),
                    icon: 'success',
                    toast: true,
                    position: 'bottom',
                    showConfirmButton: false,
                    timer: 2000,
                });
                dispatch(settingStore).setFormData([
                    ...form,
                ]);
            })
            .catch((error) => {
                Swal.fire({
                    title: __('Error', 'article-gen'),
                    text: error.message,
                    icon: 'error',
                    toast: true,
                    position: 'bottom',
                    showConfirmButton: false,
                    timer: 3000,
                });
            });
    };

    return (
        <>

            <Button
                text={
                    settingsSaving
                        ? __('Saving…', 'article-gen')
                        : __('Save', 'article-gen')
                }
                type="primary"
                icon={faCheckCircle}
                disabled={settingsSaving}
                onClick={onSubmit}
            />
        </>
    );
}
