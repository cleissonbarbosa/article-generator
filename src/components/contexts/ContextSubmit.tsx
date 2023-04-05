/**
 * External dependencies.
 */
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelect } from '@wordpress/data';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import contextStore from '../../data/contexts';
import Button from '../button/Button';
import { IContextFormData } from '../../interfaces';
import { contextDefaultFormData } from '../../data/contexts/default-state';

export default function ContextSubmit() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const form: IContextFormData = useSelect(
        (select) => select(contextStore).getForm(),
        []
    );

    const contextsSaving: boolean = useSelect(
        (select) => select(contextStore).getContextsSaving(),
        []
    );

    const backToContextsPage = () => {
        navigate('/contexts');
    };

    const validate = () => {
        if (!form.title.length) {
            return __('Please give a context title.', 'article-gen');
        }

        if (!form.content.length) {
            return __('Please give context content.', 'article-gen');
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
        dispatch(contextStore)
            .saveContext(form)
            .then(() => {
                Swal.fire({
                    title: __('Context saved', 'article-gen'),
                    text: __('Context has been saved successfully.', 'article-gen'),
                    icon: 'success',
                    toast: true,
                    position: 'bottom',
                    showConfirmButton: false,
                    timer: 2000,
                });
                dispatch(contextStore).setFormData({
                    ...contextDefaultFormData,
                });
                navigate('/contexts');
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
                text={__('Cancel', 'article-gen')}
                type="default"
                onClick={backToContextsPage}
                buttonCustomClass="mr-3"
            />

            <Button
                text={
                    contextsSaving
                        ? __('Saving…', 'article-gen')
                        : __('Save', 'article-gen')
                }
                type="primary"
                icon={faCheckCircle}
                disabled={contextsSaving}
                onClick={onSubmit}
            />
        </>
    );
}
