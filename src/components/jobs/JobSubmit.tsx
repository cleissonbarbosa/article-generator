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
import jobStore from '../../data/jobs';
import Button from '../button/Button';
import { IJobFormData } from '../../interfaces';
import { jobDefaultFormData } from '../../data/jobs/default-state';

export default function JobSubmit() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const form: IJobFormData = useSelect(
        (select) => select(jobStore).getForm(),
        []
    );

    const jobsSaving: boolean = useSelect(
        (select) => select(jobStore).getJobsSaving(),
        []
    );

    const backToJobsPage = () => {
        navigate('/jobs');
    };

    const validate = () => {
        if (!form.title.length) {
            return __('Please give a job title.', 'article-gen');
        }

        if (form.job_type_id === 0) {
            return __('Please select job type.', 'article-gen');
        }

        if (!form.description.length) {
            return __('Please give job description.', 'article-gen');
        }

        if (form.company_id === 0) {
            return __('Please select a company.', 'article-gen');
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
        dispatch(jobStore)
            .saveJob(form)
            .then(() => {
                Swal.fire({
                    title: __('Job saved', 'article-gen'),
                    text: __('Job has been saved successfully.', 'article-gen'),
                    icon: 'success',
                    toast: true,
                    position: 'bottom',
                    showConfirmButton: false,
                    timer: 2000,
                });
                dispatch(jobStore).setFormData({
                    ...jobDefaultFormData,
                });
                navigate('/jobs');
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
                onClick={backToJobsPage}
                buttonCustomClass="mr-3"
            />

            <Button
                text={
                    jobsSaving
                        ? __('Saving…', 'article-gen')
                        : __('Save', 'article-gen')
                }
                type="primary"
                icon={faCheckCircle}
                disabled={jobsSaving}
                onClick={onSubmit}
            />
        </>
    );
}
