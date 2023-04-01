/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useNavigate } from 'react-router-dom';

/**
 * Internal dependencies.
 */
import Button from '../button/Button';

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="dashboard mx-8 flex gap-5">
            <div className="card p-5">
                <h3 className="font-medium text-lg">
                    {__('Dashboard', 'article-gen')}
                </h3>
                <p>
                    {__('Edit Dashboard component at ', 'article-gen')}
                    <code>src/components/Dashboard.jsx</code>
                </p>

                <div className="mt-4">
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#00a0d2' }}
                        text={__('View Jobs', 'article-gen')}
                        onClick={() => navigate('/jobs')}
                    />
                </div>
            </div>
            <div className="card p-5">
                <h3 className="font-medium text-lg">
                    {__('Settings', 'article-gen')}
                </h3>
                <p>
                    {__('add openai settings and edit plugin settings', 'article-gen')}
                </p>

                <div className="mt-4">
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#00a0d2' }}
                        text={__('View Settings', 'article-gen')}
                        onClick={() => navigate('/settings')}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
